import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import admin from "firebase-admin";
import { MongoClient, ObjectId } from "mongodb";
import Stripe from "stripe";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
// chatbot code
app.post("/chatbot", async (req, res) => {
  try {
    console.log("🔥 Chatbot route hit");
    const userMessage = req.body.message;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are BondBot for Blood Bond website. Help users about blood donation, organ donation, myths, emergency tips.",
            },
            {
              role: "user",
              content: userMessage,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("🧠 FULL RESPONSE:", JSON.stringify(data, null, 2));

    res.json({
      reply: data.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error("❌ STRIPE_SECRET_KEY is missing");
}

const stripe = new Stripe(stripeSecretKey);

//! payment key

const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
console.log("ENV DATABASE_URL =", process.env.DATABASE_URL);
// MongoDB Client
const client = new MongoClient(DATABASE_URL);

if (!process.env.FIREBASE_SERVICE_KEY) {
  console.error("❌ FIREBASE_SERVICE_KEY missing");
}

const decoded = Buffer.from(
  process.env.FIREBASE_SERVICE_KEY,
  "base64"
).toString("utf8");

const serviceAccount = JSON.parse(decoded);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

//! Firebase Token Verification Middleware
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized access: No valid token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // decoded token (contains uid, email, etc.)
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Database Connection & Route Setup
async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully");

    const db = client.db("ZindagiDaan");
    const usersCollection = db.collection("Users");
    const organRequestCollection = db.collection("organRequests");
    const donationRequestCollection = db.collection("donationRequestData");
    const volunteerRequestCollection = db.collection("VolunteerRequest");
    const fundingCollection = db.collection("fundingCollection");

    //  admin middleware
    const verifyAdmin = async (req, res, next) => {
      try {
        const email = req.user.email;
        const user = await usersCollection.findOne({ email });

        if (!user || user.role !== "admin") {
          return res.status(403).json({ message: "Admin access required" });
        }

        next();
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }
    };

    //! ==================== USER ROUTES ====================

    //? Register / Update user data (after Firebase auth)
    app.post("/register-user", async (req, res) => {
      try {
        const userData = req.body;
        const { email } = userData;
        const adminEmail = "m.hassanasif453@gmail.com";
        const isAdminEmail =
          email?.toLowerCase?.() === adminEmail.toLowerCase();

        if (!email) {
          return res.status(400).json({ message: "Email is required" });
        }

        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
          if (isAdminEmail) {
            await usersCollection.updateOne(
              { email },
              { $set: { role: "admin", status: "active" } }
            );
            return res.status(200).json({ message: "Admin user updated" });
          }
          return res.status(200).json({ message: "User already exists" });
        }

        const result = await usersCollection.insertOne({
          ...userData,
          role: isAdminEmail ? "admin" : userData.role || "donor",
          status:
          isAdminEmail
            ? "active"
             : userData.role === "volunteer"
             ? "pending"
              : "active",
        });

        res.status(201).json({
          message: "User registered successfully",
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Failed to register user" });
      }
    });

    //? Get all users (admin only)
    app.get("/register-user", verifyToken, verifyAdmin, async (req, res) => {
      const users = await usersCollection.find({}).toArray();
      res.json(users);
    });

    //? Get user role & status (used for authorization)
    app.get("/user/:email/role", verifyToken, async (req, res) => {
      try {
        const { email } = req.params;
        const currentUser = await usersCollection.findOne({
          email: req.user.email,
        });
        const isAdmin = currentUser?.role === "admin";

        // Optional: Only allow user to check their own role or admin
        if (req.user.email !== email && !isAdmin) {
          return res.status(403).json({ message: "Forbidden" });
        }

        const user = await usersCollection.findOne({ email });

        res.json({
          role: user?.role || "donor",
          status: user?.status || "active",
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
    });

    // Update user status (block/unblock)
    app.patch("/update-user-status", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const { id, status } = req.body;

        if (!id || !status) {
          return res
            .status(400)
            .json({ message: "ID and status are required" });
        }

        const result = await usersCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status } }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User status updated successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update status" });
      }
    });
    // Update user role (admin only)
    app.patch(
      "/update-user-role/:id",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        try {
          const { role } = req.body;
          const { id } = req.params;

          if (!role) {
            return res.status(400).json({ message: "Role is required" });
          }

          const result = await usersCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { role } }
          );

          if (result.matchedCount === 0) {
            return res.status(404).json({ message: "User not found" });
          }

          res.json({ message: "User role updated successfully" });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Failed to update role" });
        }
      }
    );

    // Get profile data (hide sensitive fields)
    app.get("/profile/:email/data", verifyToken, async (req, res) => {
      try {
        const { email } = req.params;
        const currentUser = await usersCollection.findOne({
          email: req.user.email,
        });
        const isAdmin = currentUser?.role === "admin";

        // Security: Only allow own profile or admin
        if (req.user.email !== email && !isAdmin) {
          return res
            .status(403)
            .json({ message: "Forbidden: Cannot view other profiles" });
        }

        const user = await usersCollection.findOne(
          { email },
          {
            projection: {
              password: 0,
              confirmPassword: 0,
              avatar: 0, // if you store large images separately
            },
          }
        );

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
    });
    app.put("/profile/update/:email", verifyToken, async (req, res) => {
      try {
        const { email } = req.params;
        const currentUser = await usersCollection.findOne({
          email: req.user.email,
        });
        const isAdmin = currentUser?.role === "admin";

        if (req.user.email !== email && !isAdmin) {
          return res
            .status(403)
            .json({ message: "Forbidden: Cannot update this profile" });
        }

        const { name, bloodGroup, division, district, phone } = req.body;
        const updatePayload = {
          ...(name !== undefined && { name }),
          ...(bloodGroup !== undefined && { bloodGroup }),
          ...(division !== undefined && { division }),
          ...(district !== undefined && { district }),
          ...(phone !== undefined && { phone }),
          updatedAt: new Date(),
        };

        const result = await usersCollection.updateOne(
          { email },
          { $set: updatePayload }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Profile updated successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update profile" });
      }
    });

    //! ==================== DONATION REQUEST ROUTES ====================

    //? post new donation request
    app.post("/donation-request", verifyToken, async (req, res) => {
      try {
        const currentUser = await usersCollection.findOne({
  email: req.user.email,
});

// Pending volunteer block
if (
  currentUser?.role === "volunteer" &&
  currentUser?.status !== "active"
) {
  return res.status(403).json({
    message: "Admin approval pending. You cannot create requests.",
  });
}
        const requestData = {
          ...req.body,
          donationStatus: "pending",
          createdAt: new Date(),
        };

        const result = await donationRequestCollection.insertOne(requestData);
        res
          .status(201)
          .json({ message: "Request created", insertedId: result.insertedId });
      } catch (error) {
        console.error("Error creating donation request:", error);
        res.status(500).json({ message: "Failed to create request" });
      }
    });

    //? get all request with out token verification
    app.get("/donation-request", async (req, res) => {
      try {
        const requests = await donationRequestCollection
          .find()
          .sort({ createdAt: -1 })
          .toArray();
        res.json(requests);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
    });

    // ? get donation request details data
    app.get("/donation-requests-details/:id", verifyToken, async (req, res) => {
      try {
        const { id } = req.params;
        const request = await donationRequestCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!request) {
          return res.status(404).json({ message: "Request not found" });
        }

        res.json(request);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
    });

    // ? my donation request data
    app.get("/my-donation/:email/request", verifyToken, async (req, res) => {
      try {
        const { email } = req.params;

        const query = {};

        // security: token email vs params email
        if (email !== req.user.email) {
          return res.status(403).json({ message: "forbidden access" });
        }

        if (email) {
          query.requesterEmail = email;
        }

        const result = await donationRequestCollection
          .find(query)
          .sort({ createdAt: -1 })
          .toArray();

        res.json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error" });
      }
    });

    // app.get("/my-donation/:email/request", verifyToken, async (req, res) => {
    //   const result = await donationRequestCollection
    //     .find({ requesterEmail: req.params.email })
    //     .toArray();

    //   res.json(result);
    // });

    app.delete(
      "/donation-request-delete/:id",
      verifyToken,
      async (req, res) => {
        try {
          const { id } = req.params;
          const request = await donationRequestCollection.findOne({
            _id: new ObjectId(id),
          });

          if (!request) {
            return res.status(404).json({ message: "Request not found" });
          }

          // Only owner or admin can delete
         // MongoDB se actual role fetch karo
         const currentUser = await usersCollection.findOne({ email: req.user.email });
         const isAdmin = currentUser?.role === "admin";

// Only owner or admin can delete
          if (request.requesterEmail !== req.user.email && !isAdmin) {
         return res.status(403).json({ message: "Forbidden" });
          }

          await donationRequestCollection.deleteOne({ _id: new ObjectId(id) });
          res.json({ message: "Request deleted successfully" });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Failed to delete request" });
        }
      }
    );

    app.delete("/donation-request/:id", verifyToken, async (req, res) => {
      try {
        const { id } = req.params;
        const request = await donationRequestCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!request) {
          return res.status(404).json({ message: "Request not found" });
        }

        const currentUser = await usersCollection.findOne({ email: req.user.email });
        const isAdmin = currentUser?.role === "admin";

        if (request.requesterEmail !== req.user.email && !isAdmin) {
          return res.status(403).json({ message: "Forbidden" });
        }

        await donationRequestCollection.deleteOne({ _id: new ObjectId(id) });
        res.json({ message: "Request deleted successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete request" });
      }
    });
    // ? get single donation request by id (for edit)
app.get("/donation-request/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const request = await donationRequestCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ? update donation request by id (edit)
app.put("/donation-request/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Remove _id from update data if present
    delete updatedData._id;

    const result = await donationRequestCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updatedData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ message: "Request updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update request" });
  }
});

app.patch("/donation-request/:id/status", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { donationStatus, donorName, donorEmail } = req.body;
    const validStatuses = ["pending", "inprogress", "done", "canceled"];

    if (!validStatuses.includes(donationStatus)) {
      return res.status(400).json({ message: "Invalid donation status" });
    }

    const request = await donationRequestCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const currentUser = await usersCollection.findOne({ email: req.user.email });
    const role = currentUser?.role;
   const isPrivileged =
  role === "admin" ||
  (role === "volunteer" && currentUser?.status === "active") ||
  role === "donor";
const isOwner = request.requesterEmail === req.user.email;

if (!isPrivileged && !isOwner) {
  return res.status(403).json({ message: "Forbidden" });
}

   const updateDoc = {
  donationStatus,
  updatedAt: new Date(),
};

// donor info save whenever provided
if (donorName && donorEmail) {
  updateDoc.donorName = donorName;
  updateDoc.donorEmail = donorEmail;
}

    await donationRequestCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );

    res.json({ message: "Donation request status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update status" });
  }
});

app.get("/user-stats/:email", verifyToken, async (req, res) => {
  try {
    const { email } = req.params;
    const currentUser = await usersCollection.findOne({ email: req.user.email });
    const isAdmin = currentUser?.role === "admin";

    if (req.user.email !== email && !isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const requests = await donationRequestCollection
      .find({ requesterEmail: email })
      .toArray();

    const totalRequests = requests.length;
    const completedDonations = requests.filter(
      (item) => item.donationStatus === "done"
    ).length;
    const pendingRequests = requests.filter(
      (item) => item.donationStatus === "pending"
    ).length;
    const inProgressRequests = requests.filter(
      (item) => item.donationStatus === "inprogress"
    ).length;
    const canceledRequests = requests.filter(
      (item) => item.donationStatus === "canceled"
    ).length;

    const uniqueDonors = new Set(
      requests
        .filter((item) => item.donorEmail)
        .map((item) => item.donorEmail.toLowerCase())
    );

    const successRate = totalRequests
      ? Math.round((completedDonations / totalRequests) * 100)
      : 0;

    res.json({
      totalRequests,
      completedDonations,
      pendingRequests,
      inProgressRequests,
      canceledRequests,
      totalDonorsHelped: uniqueDonors.size,
      averageResponseTime: "N/A",
      successRate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load user stats" });
  }
});

    //! ==================== VOLUNTEER REQUEST ROUTES ====================

    //? post new volunteer request
   app.post("/volunteer-applications", async (req, res) => {
      try {
        const application = {
          ...req.body,
          createdAt: new Date(),
        };

        const result = await volunteerRequestCollection.insertOne(application);
        res.status(201).json({
          message: "Application submitted",
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to submit application" });
      }
    });
    // ? get all volunteer request
    app.get(
      "/volunteer-applications",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        try {
          const applications = await volunteerRequestCollection
            .find()
            .sort({ createdAt: -1 })
            .toArray();
          res.json(applications);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Server error" });
        }
      }
    );

    // ? delete single volunteer request
    app.delete(
      "/volunteer-applications/:id",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        const { id } = req.params;
        const query = { _id: new ObjectId(id) };

        const result = await volunteerRequestCollection.deleteOne(query);
        res.status(200).json(result);
      }
    );

    // ?update user approve
    app.patch(
      "/volunteer-applications/:id/approve",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        const { id } = req.params;
        const query = { _id: new ObjectId(id) };
        const application = await volunteerRequestCollection.findOne(query);

        if (!application) {
          return res.status(404).json({ message: "Application not found" });
        }

        const updateDoc = {
          $set: {
            status: "approve",
          },
        };

        const result = await volunteerRequestCollection.updateOne(
          query,
          updateDoc
        );

        if (application.email) {
          await usersCollection.updateOne(
            { email: application.email },
            {
              $set: {
                role: "volunteer",
                status: "active",
              },
            }
          );
        }

        res.status(200).json(result);
      }
    );

    // ? update user reject
    app.patch(
      "/volunteer-applications/:id/reject",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        const { id } = req.params;
        const query = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            status: "reject",
          },
        };

        const result = await volunteerRequestCollection.updateOne(
          query,
          updateDoc
        );
        res.status(200).json(result);
      }
    );

// POST - Create organ request (koi bhi logged-in user)
app.post("/organ-request", verifyToken, async (req, res) => {
  try {
    const organData = {
      ...req.body,
      requestStatus: "pending",
      createdAt: new Date(),
    };
    const result = await organRequestCollection.insertOne(organData);
    res.status(201).json({
      message: "Organ request created successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating organ request:", error);
    res.status(500).json({ message: "Failed to create organ request" });
  }
});
app.get("/organ-request", async (req, res) => {
  try {
    const requests = await organRequestCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET - My organ requests (apni requests)
app.get("/my-organ-requests/:email", verifyToken, async (req, res) => {
  try {
    const { email } = req.params;
 
    if (email !== req.user.email) {
      return res.status(403).json({ message: "Forbidden" });
    }
 
    const result = await organRequestCollection
      .find({ requesterEmail: email })
      .sort({ createdAt: -1 })
      .toArray();
 
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
// index.js mein GET /my-organ-requests ke baad add karo:
app.get("/organ-request/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const request = await organRequestCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
 
// PATCH - Update organ request status (admin + volunteer)
app.patch("/organ-request/:id/status", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { requestStatus, donorName, donorEmail } = req.body; // ✅ donor info bhi lo

    const validStatuses = ["pending", "inprogress", "fulfilled", "rejected"];
    if (!validStatuses.includes(requestStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const currentUser = await usersCollection.findOne({ email: req.user.email });
    const role = currentUser?.role;

    const isPrivileged = role === "admin" || role === "volunteer" || role === "donor";
    if (!isPrivileged) {
      return res.status(403).json({ message: "Access denied" });
    }

    // ✅ donor info bhi save karo
    const updateDoc = {
      requestStatus,
      updatedAt: new Date(),
      ...(donorName && { donorName }),
      ...(donorEmail && { donorEmail }),
    };

    const result = await organRequestCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );

    
 
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Request not found" });
    }
 
    res.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update status" });
  }
});
 
// DELETE - Delete organ request
app.delete("/organ-request/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const request = await organRequestCollection.findOne({ _id: new ObjectId(id) });
 
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
 
    const currentUser = await usersCollection.findOne({ email: req.user.email });
    const isAdmin = currentUser?.role === "admin";
 
    // Sirf owner ya admin delete kar sakta hai
    if (request.requesterEmail !== req.user.email && !isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }
 
    await organRequestCollection.deleteOne({ _id: new ObjectId(id) });
    res.json({ message: "Organ request deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete organ request" });
  }
});
 
    //! ==================== PAYMENT RELATED ROUTES ====================

    app.post("/create-checkout-session", async (req, res) => {
      try {
        const paymentInfo = req.body;

        const amount = parseInt(paymentInfo.found) * 100;

        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              price_data: {
                currency: "usd",
                unit_amount: amount,
                product_data: {
                  name: `Donation by ${paymentInfo.name}`,
                  description: `Founder Email: ${paymentInfo.email}`,
                },
              },
              quantity: 1,
            },
          ],

          customer_email: paymentInfo.email,
          mode: "payment",
          success_url: `${process.env.SITE_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.SITE_DOMAIN}/cancel`,
        });

        res.send({ url: session.url });
      } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).send({ error: error.message });
      }
    });

    //! ==================== Funding post and get  ====================
    app.post("/save-founder-details", async (req, res) => {
      const sessionId = req.query.session_id;

      const session = await stripe.checkout.sessions.retrieve(sessionId);

      const name = session.customer_details?.name;
      const email = session.customer_details?.email;
      const amount = session.amount_total / 100;
      const createAt = new Date(session.created * 1000);

      const fundingData = {
        name,
        email,
        amount,
        createAt,
      };
      const result = await fundingCollection.insertOne(fundingData);
      res.json(result);
    });

    app.get("/funding-all-info", verifyToken, verifyAdmin, async (req, res) => {
      const result = await fundingCollection.find().toArray();
      res.send(result);
    });

    //! ==================== ROOT ROUTE ====================
    app.get("/", (req, res) => {
      res.send("BloodBond Backend Server is running!");
    });
  } catch (error) {
    console.error("Failed to connect to database:", error);
    // process.exit(1);
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("BloodBond Backend Server is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
