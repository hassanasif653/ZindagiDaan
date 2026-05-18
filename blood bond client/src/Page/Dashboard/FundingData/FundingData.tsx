import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/Hook/useAxiosSecure";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, Users, Calendar, Mail } from "lucide-react";
import DashboardSpinner from "@/Page/Shared/Spinner/DashboardSpinner";

interface FundingData {
  _id?: string;
  name: string;
  email: string;
  amount: number;
  createAt: string;
}

const FundingTable = () => {
  const axiosSecure = useAxiosSecure();

  const { data: funds = [], isLoading } = useQuery<FundingData[]>({
    queryKey: ["all-funds-admin"],
    queryFn: async () => {
      const res = await axiosSecure.get("/funding-all-info");
      return res.data;
    },
  });

  const totalAmount = funds.reduce(
    (acc: number, item: FundingData) => acc + (Number(item.amount) || 0),
    0
  );

  if (isLoading) return <DashboardSpinner />;

  return (
    <div className="py-8 space-y-6">
      <Card className="border-none shadow-xl bg-card">
        <CardHeader className="border-b border-border/50 pb-6">
          <CardTitle className="text-2xl font-black flex items-center gap-2 text-foreground">
            <Users className="text-primary w-6 h-6" />
            Funding Overview
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Detailed list of all community contributions.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="font-bold py-4 text-foreground">
                  Name
                </TableHead>
                <TableHead className="font-bold text-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email
                  </div>
                </TableHead>
                <TableHead className="font-bold text-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Date
                  </div>
                </TableHead>
                <TableHead className="text-right font-bold pr-6 text-foreground">
                  <div className="flex items-center justify-end gap-1">
                    <DollarSign className="w-3 h-3" /> Amount
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {funds.length > 0 ? (
                funds.map((fund) => (
                  <TableRow
                    key={fund._id}
                    className="border-border/50 hover:bg-muted/10 transition-colors">
                    <TableCell className="font-semibold py-4 text-foreground/90">
                      {fund.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-medium">
                      {fund.email}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-medium">
                      {fund.createAt
                        ? format(new Date(fund.createAt), "dd MMM yyyy")
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right font-black text-primary pr-6">
                      ${Number(fund.amount).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground">
                    No contributions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

            <TableFooter className="bg-muted/50 border-t-2 border-primary/20">
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={3}
                  className="text-lg font-black py-6 px-6 text-foreground">
                  Total Funds Collected
                </TableCell>
                <TableCell className="text-right text-2xl font-black text-primary pr-6">
                  ${totalAmount.toLocaleString()}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FundingTable;
