import { useState } from "react";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ✅ Custom red marker
const redMarker = new L.DivIcon({
  className: "",
  html: `
    <div style="
      width: 32px;
      height: 32px;
      background: #ef4444;
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    ">
      <div style="
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      "></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -35],
});

const LOCATION = {
  lat: 24.883329,
  lng: 67.164402,
  label: "BloodConnect HQ, Karachi",
};

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section className="my-10">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Contact Us
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Have questions or want to get involved? Reach out to our team and
          we'll be happy to help.
        </p>
      </div>

      <div className="flex items-stretch justify-between flex-col md:flex-row gap-12 pt-10">
        {/* Contact Form */}
        <div className="bg-card/50 border border-secondary rounded-md shadow-lg flex-1 w-full p-4 md:p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">
            Send us a message
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div>
              <Label className="mb-1">Your Name</Label>
              <Input
                type="text"
                placeholder="Hassan Asif"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label className="mb-1">Email Address</Label>
              <Input
                type="email"
                placeholder="hassan@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label className="mb-1">Subject</Label>
              <Input
                type="text"
                placeholder="How can we help?"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>
            <div>
              <Label className="mb-1">Your Message</Label>
              <Textarea
                rows={5}
                placeholder="Type your message here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </div>

        {/* ✅ Map with red marker */}
        <div className="flex-1 w-full rounded-md shadow-lg overflow-hidden min-h-[400px]">
          <MapContainer
            center={[LOCATION.lat, LOCATION.lng]}
            zoom={13}
            style={{ height: "100%", minHeight: "400px", width: "100%" }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[LOCATION.lat, LOCATION.lng]} icon={redMarker}>
              <Popup>{LOCATION.label}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;