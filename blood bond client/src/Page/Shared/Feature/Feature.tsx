import {
  FaUserFriends,
  FaHandHoldingHeart,
  FaMoneyBillWave,
  FaSearch,
} from "react-icons/fa";
import Container from "../Responsive/Container";

const Features = () => {
  const features = [
    {
      icon: FaUserFriends,
      title: "Total Donors",
      desc: "1,234 donors registered in our community.",
    },
    {
      icon: FaHandHoldingHeart,
      title: "Total Donations",
      desc: "567 successful blood donations recorded.",
    },
    {
      icon: FaMoneyBillWave,
      title: "Total Funds",
      desc: "$12,345 donated to support the cause.",
    },
    {
      icon: FaSearch,
      title: "Recent Requests",
      desc: "3 latest donation requests to serve.",
    },
  ];

  return (
    <section className="py-10">
      <Container>
        <div className="text-center ">
          <h2 className="text-4xl font-bold text-foreground mb-14">
            Our Impact
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
            {features.map((feature, i) => (
              <div
                key={i}
                className="relative p-6 rounded-md bg-card/50 border border-border  hover:-translate-y-2 transition-all duration-500">
                <feature.icon className="text-primary text-5xl mb-5 mx-auto" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Features;
