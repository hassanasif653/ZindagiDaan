import React, { useState, useMemo, useEffect } from "react";
import { Search,AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/Hook/useAxiosSecure";

import DonationRequestCard from "./Shared/DonationRequestCard/DonationRequestCard";
import type { bloodDonation } from "@/types/blog";
import Container from "../Shared/Responsive/Container";
import DashboardSpinner from "@/Page/Shared/Spinner/DashboardSpinner";
import {
  loadPakistanLocations,
  type City,
  type Province,
} from "@/lib/pakistanLocations";

const BloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const FindBloodInput: React.FC = () => {
  const [bloodGroup, setBloodGroup] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [isSearched, setIsSearched] = useState(false);

  const [allProvinces, setAllProvinces] = useState<Province[]>([]);
  const [allCities, setAllCities] = useState<City[]>([]);

  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    loadPakistanLocations()
      .then(({ provinces, cities }) => {
        setAllProvinces(provinces);
        setAllCities(cities);
      })
      .catch((error) => {
        console.error("Failed to load location data:", error);
        setAllProvinces([]);
        setAllCities([]);
      });
  }, []);

  // API data
  const { data: bloodData = [], isLoading: bloodLoading } = useQuery({
  queryKey: ["card-data"],
  queryFn: async () => {
    const res = await axiosSecure.get("/donation-request");
    return res.data;
  },
});


// Organ requests bhi fetch karo
const { data: organData = [], isLoading: organLoading } = useQuery({
  queryKey: ["organ-card-data"],
  queryFn: async () => {
    const res = await axiosSecure.get("/organ-request");  // ✅ sahi URL
    return res.data;
  },
});

const donationCardData = [...(bloodData as any[]), ...(organData as any[])];
const isLoading = bloodLoading || organLoading;

  // filter cities based on province
  const availableCities = useMemo(() => {
    if (!province) return [];
    return allCities.filter((c) => c.province_id === province);
  }, [province, allCities]);

  const selectedProvinceName =
  allProvinces.find((p) => String(p.id) === String(province))?.name || "";
const selectedCityName =
  allCities.find((c) => String(c.id) === String(city))?.name || "";

  // filtering logic
// YEH LAGAO:
// YEH LAGAO:
const filteredRequests = useMemo(() => {
  if (!isSearched) return [];

  return donationCardData.filter((item: any) => {
    // Blood group match
    const matchBlood = bloodGroup ? item.bloodGroup === bloodGroup : true;

    // Province match — ID se bhi, name se bhi
    const matchProvince = province
      ? String(item.provinceId) === String(province) ||
        item.provinceName?.toLowerCase() === selectedProvinceName?.toLowerCase() ||
        item.recipientDivision?.toLowerCase() === selectedProvinceName?.toLowerCase()
      : true;

    // City match — ID se bhi, name se bhi
    const matchCity = city
      ? String(item.cityId) === String(city) ||
        item.cityName?.toLowerCase() === selectedCityName?.toLowerCase() ||
        item.recipientDistrict?.toLowerCase() === selectedCityName?.toLowerCase()
      : true;

    return matchBlood && matchProvince && matchCity;
  });
}, [
  donationCardData,
  bloodGroup,
  province,
  city,
  isSearched,
  selectedProvinceName,
  selectedCityName,
]);

  // province change
  const handleProvinceChange = (value: string) => {
    setProvince(value);
    setCity("");
  };

  // search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearched(true);
  };

  // reset
  const handleReset = () => {
    setBloodGroup("");
    setProvince("");
    setCity("");
    setIsSearched(false);
  };

  return (
    <Container>
      {/* Header */}
      <div className="text-center pb-6 border-b border-border mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary flex items-center justify-center gap-2">
          <Search className="w-7 h-7 text-destructive" />
          Find Lifesaving Blood
        </h1>
        <p className="text-muted-foreground mt-2">
          Connect with verified donors instantly
        </p>
      </div>

      {/* Form */}
      <div className="bg-card/50 p-6 rounded-lg border max-w-5xl mx-auto mb-10">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Blood */}
          <div>
            <Label>Blood Group</Label>
            <Select value={bloodGroup} onValueChange={setBloodGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {BloodGroups.map((bg) => (
                  <SelectItem key={bg} value={bg}>
                    {bg}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Province */}
          <div>
            <Label>Province</Label>
            <Select value={province} onValueChange={handleProvinceChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Province" />
              </SelectTrigger>
              <SelectContent>
                {allProvinces.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City */}
          <div>
            <Label>City</Label>
            <Select value={city} onValueChange={setCity} disabled={!province}>
              <SelectTrigger>
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                {availableCities.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Button */}
          <div className="flex items-end gap-2">
           <Button type="submit">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>

            {isSearched && (
              <Button type="button" variant="outline" onClick={handleReset}>
                <RefreshCcw className="w-4 h-4" />
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Results */}
      {isLoading ? (
        <DashboardSpinner />
      ) : (
        <>
          {isSearched && (
            <div className="mb-4 p-3 bg-primary/10 border-l-4 border-primary">
              <AlertCircle className="inline w-4 h-4 mr-2" />
              Found {filteredRequests.length} results in {selectedCityName}, {selectedProvinceName}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredRequests.map((item: bloodDonation) => (
              <DonationRequestCard key={item._id} donationdata={item} />
            ))}
          </div>

          {isSearched && filteredRequests.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              No matching results found
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default FindBloodInput;
