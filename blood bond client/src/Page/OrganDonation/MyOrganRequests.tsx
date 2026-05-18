import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Clock,
  Edit,
  Eye,
  Filter,
  HeartPulse,
  List,
  MapPin,
  Search,
  Stethoscope,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";

import Container from "@/Page/Shared/Responsive/Container";
import useAuth from "@/Hook/useAuth";
import useAxiosSecure from "@/Hook/useAxiosSecure";
import DashboardSpinner from "@/Page/Shared/Spinner/DashboardSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type RequestStatus = "pending" | "inprogress" | "rejected" | "fulfilled";
type UrgencyLevel = "Low" | "Medium" | "High" | "Critical";

interface OrganRequest {
  _id: string;
  patientName: string;
  organType: string;
  bloodGroup: string;
  hospitalName: string;
  provinceName?: string;
  cityName?: string;
  neededDate: string;
  urgency: UrgencyLevel;
  requestStatus: RequestStatus;
  requesterEmail: string;
  requesterName: string;
  requestMessage?: string;
}

const ITEMS_PER_PAGE = 8;

const getStatusBadge = (status: RequestStatus) => {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 dark:text-yellow-500">
          Pending
        </Badge>
      );
    case "inprogress":
  return (
    <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 dark:text-blue-500">
      In Progress
    </Badge>
  );
    case "fulfilled":
      return (
        <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-500">
          Fulfilled
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:text-red-500">
          Rejected
        </Badge>
      );
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getUrgencyBadge = (urgency: UrgencyLevel) => {
  switch (urgency) {
    case "Critical":
      return <Badge className="bg-red-500/10 text-red-600 dark:text-red-400">Critical</Badge>;
    case "High":
      return <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400">High</Badge>;
    case "Medium":
      return <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">Medium</Badge>;
    case "Low":
      return <Badge className="bg-green-500/10 text-green-600 dark:text-green-400">Low</Badge>;
    default:
      return <Badge variant="outline">{urgency}</Badge>;
  }
};

const MyOrganRequests: React.FC = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<RequestStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);

  const {
    data: requests = [],
    isLoading,
    error,
  } = useQuery<OrganRequest[]>({
    queryKey: ["my-organ-requests", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(
        `/my-organ-requests/${user?.email}`
      );
      return response.data;
    },
    enabled: !!user?.email,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosSecure.delete(`/organ-request/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-organ-requests"] });
      toast.success("Organ request deleted successfully!");
      setDeleteDialogOpen(false);
      setRequestToDelete(null);
    },
    onError: (mutationError) => {
      console.error("Error deleting request:", mutationError);
      toast.error("Failed to delete organ request. Please try again.");
    },
  });

  const filteredRequests = useMemo(() => {
    let filtered = [...requests];

    if (filterStatus !== "all") {
      filtered = filtered.filter((item) => item.requestStatus === filterStatus);
    }

    if (searchTerm) {
      const value = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.patientName?.toLowerCase().includes(value) ||
          item.organType?.toLowerCase().includes(value) ||
          item.hospitalName?.toLowerCase().includes(value)
      );
    }

    return filtered;
  }, [requests, filterStatus, searchTerm]);

  const totalItems = filteredRequests.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRequests, currentPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) setCurrentPage(page);
    },
    [totalPages]
  );

  const handleDeleteClick = (id: string) => {
    setRequestToDelete(id);
    setDeleteDialogOpen(true);
  };

  const formatDate = (value?: string) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <DashboardSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Error Loading Requests
          </h2>
          <p className="text-muted-foreground">
            Failed to load your organ requests. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 md:py-10">
      <Container>
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground flex items-center gap-3">
            <List className="w-7 h-7 md:w-8 md:h-8 text-primary" />
            My Organ Requests
          </h1>
          <p className="mt-2 text-base md:text-xl text-muted-foreground">
            Track and manage all of your organ donation requests.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 pb-4 border-b">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
            <h2 className="text-lg md:text-xl font-semibold text-foreground flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              Filter Requests ({totalItems} total)
            </h2>

            <Select
              value={filterStatus}
              onValueChange={(value) =>
                setFilterStatus(value as RequestStatus | "all")
              }>
              <SelectTrigger className="w-full sm:w-[200px] bg-card border-2">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inprogress">In Progress</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="relative w-full lg:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by patient, organ, hospital..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full lg:w-[300px] border-2"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-bold text-primary">Patient</TableHead>
                <TableHead className="font-bold text-primary">
                  <Stethoscope className="w-4 h-4 inline mr-1" /> Organ
                </TableHead>
                <TableHead className="font-bold text-primary">
                  <HeartPulse className="w-4 h-4 inline mr-1" /> Blood
                </TableHead>
                <TableHead className="font-bold text-primary">
                  <MapPin className="w-4 h-4 inline mr-1" /> Hospital
                </TableHead>
                <TableHead className="font-bold text-primary">
                  <Clock className="w-4 h-4 inline mr-1" /> Needed By
                </TableHead>
                <TableHead className="font-bold text-primary text-center">Urgency</TableHead>
                <TableHead className="font-bold text-primary text-center">Status</TableHead>
                <TableHead className="font-bold text-primary text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRequests.length > 0 ? (
                paginatedRequests.map((item) => (
                  <TableRow key={item._id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{item.patientName}</TableCell>
                    <TableCell className="font-semibold text-primary">{item.organType}</TableCell>
                    <TableCell className="font-bold text-destructive">{item.bloodGroup}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.hospitalName}</TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{formatDate(item.neededDate)}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      {getUrgencyBadge(item.urgency)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(item.requestStatus)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/organ-request/${item._id}`)}
                          className="hover:bg-primary/10">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {item.requestStatus === "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/dashboard/edit-organ-request/${item._id}`)}
                            className="hover:bg-blue-500/10 text-blue-600">
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(item._id)}
                          className="hover:bg-destructive/10 text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="w-12 h-12 text-muted-foreground/50" />
                      <p>No organ requests found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {paginatedRequests.length > 0 ? (
            paginatedRequests.map((item) => (
              <div
                key={item._id}
                className="bg-card border border-border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base">{item.patientName}</h3>
                    <p className="text-sm text-muted-foreground">{item.organType}</p>
                  </div>
                  <Badge className="bg-destructive/10 text-destructive">
                    {item.bloodGroup}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span>{item.hospitalName}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>Needed by: {formatDate(item.neededDate)}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex gap-2">
                    {getUrgencyBadge(item.urgency)}
                    {getStatusBadge(item.requestStatus)}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm"
                      onClick={() => navigate(`/organ-request/${item._id}`)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    {item.requestStatus === "pending" && (
                      <Button variant="outline" size="sm"
                        onClick={() => navigate(`/dashboard/edit-organ-request/${item._id}`)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm"
                      onClick={() => handleDeleteClick(item._id)}
                      className="text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground mb-4">No organ requests found</p>
              <Button onClick={() => navigate("/dashboard/create-organ-request")}>
                Create Organ Request
              </Button>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer hover:bg-primary/10"
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={page === currentPage}
                    className={
                      page === currentPage
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-default"
                        : "cursor-pointer hover:bg-primary/10"
                    }>
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer hover:bg-primary/10"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </Container>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              organ request.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                requestToDelete && deleteMutation.mutate(requestToDelete)
              }
              className="bg-destructive hover:bg-destructive/90">
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyOrganRequests;