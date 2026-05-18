import React, { useState, useMemo, useCallback } from "react";
import { recordDonationOnBlockchain } from "@/lib/blockchain";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  HeartPulse,
  Filter,
  Clock,
  MapPin,
  List,
  XCircle,
  CheckCircle,
  Hourglass,
  RefreshCw,
  Eye,
  Trash2,
  Edit,
  AlertCircle,
  Search,
} from "lucide-react";
import { toast } from "react-toastify";

// Shadcn UI Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import Container from "@/Page/Shared/Responsive/Container";
import useAxiosSecure from "@/Hook/useAxiosSecure";
import DashboardSpinner from "@/Page/Shared/Spinner/DashboardSpinner";

type DonationStatus = "pending" | "inprogress" | "done" | "canceled";

const ITEMS_PER_PAGE = 5;

// Status Badge Component
const getStatusBadge = (status: DonationStatus) => {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 dark:text-yellow-500">
          <Hourglass className="w-3 h-3 mr-1" /> Pending
        </Badge>
      );
    case "inprogress":
      return (
        <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 dark:text-blue-500">
          <RefreshCw className="w-3 h-3 mr-1" /> In Progress
        </Badge>
      );
    case "done":
      return (
        <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-500">
          <CheckCircle className="w-3 h-3 mr-1" /> Done
        </Badge>
      );
    case "canceled":
      return (
        <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:text-red-500">
          <XCircle className="w-3 h-3 mr-1" /> Canceled
        </Badge>
      );
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

// Custom Pagination Component
interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            className={
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer hover:bg-primary/10"
            }
          />
        </PaginationItem>

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => onPageChange(page)}
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
            onClick={() => onPageChange(currentPage + 1)}
            className={
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer hover:bg-primary/10"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

// Main Component
const AllDonationRequest: React.FC = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [filterStatus, setFilterStatus] = useState<DonationStatus | "all">(
    "all"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);

  // Fetch all donation requests
  const { data: bloodRequests = [], isLoading: bloodLoading } = useQuery({
    queryKey: ["all-donation-requests"],
    queryFn: async () => {
      const response = await axiosSecure.get("/donation-request");
      return response.data;
    },
  });

  const { data: organRequests = [], isLoading: organLoading } = useQuery({
    queryKey: ["all-organ-requests"],
    queryFn: async () => {
      const response = await axiosSecure.get("/organ-request");
      return response.data;
    },
  });

  const allRequests = [...bloodRequests, ...organRequests];
  const isLoading = bloodLoading || organLoading

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosSecure.delete(`/donation-request-delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-donation-requests"] });
      toast.success("Donation request deleted successfully!");
      setDeleteDialogOpen(false);
      setRequestToDelete(null);
    },
    onError: (error) => {
      console.error("Error deleting request:", error);
      toast.error("Failed to delete donation request. Please try again.");
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: DonationStatus;
    }) => {
      await axiosSecure.patch(`/donation-request/${id}/status`, {
        donationStatus: status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-donation-requests"] });
      toast.success("Status updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating status:", error);
      toast.error("Failed to update status. Please try again.");
    },
  });

  // Filtering and Search Logic
  const filteredRequests = useMemo(() => {
    let filtered = [...allRequests];

    if (filterStatus !== "all") {
      filtered = filtered.filter((req) =>
        req.organType
          ? req.requestStatus === filterStatus
          : req.donationStatus === filterStatus
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (req) =>
          req.requesterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.recipientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.bloodGroup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [allRequests, filterStatus, searchTerm]);

  // Pagination Logic
  const totalItems = filteredRequests.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredRequests.slice(startIndex, endIndex);
  }, [filteredRequests, currentPage]);

  // Reset page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchTerm]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
  );

  // Handle View Details
  const handleViewDetails = (id: string) => {
    navigate(`/donation-request/${id}`);
  };

  // Handle Edit
  const handleEdit = (id: string) => {
    navigate(`/dashboard/edit-donation-request/${id}`);
  };

  // Handle Delete
  const handleDeleteClick = (id: string) => {
    setRequestToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!requestToDelete) return;
    const isOrgan = allRequests.find((r: any) => r._id === requestToDelete)?.organType;
    if (isOrgan) {
      axiosSecure.delete(`/organ-request/${requestToDelete}`).then(() => {
        queryClient.invalidateQueries({ queryKey: ["all-organ-requests"] });
        toast.success("Deleted successfully!");
        setDeleteDialogOpen(false);
        setRequestToDelete(null);
      });
    } else {
      deleteMutation.mutate(requestToDelete);
    }
  };

  // Handle Status Update
  const handleStatusUpdate = async (id: string, status: DonationStatus) => {
    try {
      const req = allRequests.find((r) => r._id === id);
      if (!req) return;

      // 1. Update backend status first
      await updateStatusMutation.mutateAsync({ id, status });

      // 2. Only run blockchain on final success
      const isFinal = status === "done";
      if (!isFinal) return;

      toast.info("Confirming blockchain transaction...");

      const isOrgan = !!req.organType;

      const result = await recordDonationOnBlockchain(
        req.donorEmail || req.requesterEmail,
        req.recipientName || req.patientName,
        isOrgan ? "organ" : "blood",
        isOrgan ? req.organType : req.bloodGroup
      );

      if (result.success) {
        toast.success(`Blockchain saved: ${result.txHash?.slice(0, 10)}...`);
      } else {
        toast.error(result.error || "Blockchain failed");
      }

    } catch (error) {
      toast.error("Status update failed");
    }
  };
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time
  const formatTime = (timeString: string) => {
    if (!timeString) return "N/A";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const statusOptions = [
    { value: "all", label: "All Requests" },
    { value: "pending", label: "Pending" },
    { value: "inprogress", label: "In Progress" },
    { value: "done", label: "Done" },
    { value: "canceled", label: "Canceled" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <DashboardSpinner />
      </div>
    );
  }

  // Error State


  return (
    <div className="min-h-screen bg-background py-8 md:py-10">
      <Container>
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground flex items-center gap-3">
            <List className="w-7 h-7 md:w-8 md:h-8 text-primary" />
            All Donation Requests
          </h1>
          <p className="mt-2 text-base md:text-xl text-muted-foreground">
            Manage all blood donation requests from all users across the
            platform.
          </p>
        </header>

        {/* Filter and Search Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 pb-4 border-b">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
            <h2 className="text-lg md:text-xl font-semibold text-foreground flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              Filter Requests ({totalItems} total)
            </h2>

            <Select
              onValueChange={(value: DonationStatus | "all") =>
                setFilterStatus(value)
              }
              value={filterStatus}>
              <SelectTrigger className="w-full sm:w-[200px] bg-card border-2">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, blood group..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full lg:w-[300px] border-2"
            />
          </div>
        </div>

        {/* Data Table - Desktop */}
        <div className="hidden md:block overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-bold text-primary">Avatar</TableHead>
                <TableHead className="font-bold text-primary">
                  Requester
                </TableHead>
                <TableHead className="font-bold text-primary">
                  Recipient
                </TableHead>
                <TableHead className="font-bold text-primary">
                  <HeartPulse className="w-4 h-4 inline mr-1" /> Blood
                </TableHead>
                <TableHead className="font-bold text-primary">
                  <MapPin className="w-4 h-4 inline mr-1" /> Hospital
                </TableHead>
                <TableHead className="font-bold text-primary">
                  <Clock className="w-4 h-4 inline mr-1" /> Date & Time
                </TableHead>
                <TableHead className="font-bold text-primary text-center">
                  Status
                </TableHead>
                <TableHead className="font-bold text-primary text-center">
                  Donor Info
                </TableHead>
                <TableHead className="font-bold text-primary text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRequests.length > 0 ? (
                paginatedRequests.map((request) => (
                  <TableRow key={request._id} className="hover:bg-muted/50">
                    <TableCell>
                      <figure className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
                        <img
                          src={
                            request.imageURL ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              request.requesterName || "User"
                            )}&background=random`
                          }
                          alt={request.requesterName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              request.requesterName || "User"
                            )}&background=random`;
                          }}
                        />
                      </figure>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="text-sm">
                        <div>{request.requesterName}</div>
                        <div className="text-xs text-muted-foreground">
                          {request.requesterEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {request.recipientName || request.patientName || "N/A"}
                    </TableCell>
                    <TableCell className="font-bold text-destructive">
                      {request.bloodGroup}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {request.hospitalName}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {formatDate(request.donationDate || request.neededDate)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {request.donationTime ? formatTime(request.donationTime) : "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {request.organType ? (
                        <Badge className={
                          request.requestStatus === "pending"
                            ? "bg-yellow-500/10 text-yellow-600"
                            : request.requestStatus === "inprogress"
                              ? "bg-blue-500/10 text-blue-600"
                              : request.requestStatus === "fulfilled"
                                ? "bg-green-500/10 text-green-600"
                                : request.requestStatus === "rejected"
                                  ? "bg-red-500/10 text-red-600"
                                  : "bg-gray-500/10 text-gray-600"
                        }>
                          {request.requestStatus || "Pending"}
                        </Badge>
                      ) : (
                        getStatusBadge(request.donationStatus as DonationStatus)
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {request.donorName ? (
                        <div className="text-xs">
                          <div className="font-medium text-blue-600">
                            {request.donorName}
                          </div>
                          <div className="text-muted-foreground">
                            {request.donorEmail || "-"}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* View Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(request._id)}
                          className="hover:bg-primary/10">
                          <Eye className="w-4 h-4" />
                        </Button>

                        {/* Edit Button - Only for pending */}
                        {request.donationStatus === "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(request._id)}
                            className="hover:bg-blue-500/10 text-blue-600">
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(request._id)}
                          className="hover:bg-destructive/10 text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>

                        {/* Cancel Button - Only for blood inprogress */}
                        {!request.organType && request.donationStatus === "inprogress" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusUpdate(request._id, "canceled")}
                            className="hover:bg-red-500/10 text-red-600">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}

                        {/* Fulfilled Button - Only for organ inprogress */}
                        {request.organType && request.requestStatus === "inprogress" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              axiosSecure.patch(`/organ-request/${request._id}/status`, {
                                requestStatus: "fulfilled",
                              }).then(() => {
                                queryClient.invalidateQueries({ queryKey: ["all-organ-requests"] });
                                toast.success("Marked as fulfilled!");
                              });
                            }}
                            className="hover:bg-green-500/10 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}

                        {/* Rejected Button - Only for organ inprogress */}
                        {request.organType && request.requestStatus === "inprogress" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              axiosSecure.patch(`/organ-request/${request._id}/status`, {
                                requestStatus: "rejected",
                              }).then(() => {
                                queryClient.invalidateQueries({ queryKey: ["all-organ-requests"] });
                                toast.success("Marked as rejected!");
                              });
                            }}
                            className="hover:bg-red-500/10 text-red-600">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}

                        {/* Cancel Button - Only for inprogress */}
                        {request.donationStatus === "inprogress" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(request._id, "canceled")
                            }
                            className="hover:bg-red-500/10 text-red-600">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="w-12 h-12 text-muted-foreground/50" />
                      <p>No donation requests found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {paginatedRequests.length > 0 ? (
            paginatedRequests.map((request) => (
              <div
                key={request._id}
                className="bg-card border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <figure className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden shrink-0">
                    <img
                      src={
                        request.imageURL ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          request.requesterName || "User"
                        )}&background=random`
                      }
                      alt={request.requesterName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          request.requesterName || "User"
                        )}&background=random`;
                      }}
                    />
                  </figure>
                  <div className="flex-1">
                    <h3 className="font-bold text-base">
                      {request.requesterName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      For: {request.recipientName}
                    </p>
                  </div>
                  <Badge className="bg-destructive/10 text-destructive">
                    {request.bloodGroup}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-muted-foreground">
                      {request.hospitalName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <span>
                      {formatDate(request.donationDate)} at{" "}
                      {formatTime(request.donationTime)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  {/* Replace karo: */}
                  {request.organType ? (
                    <Badge className={
                      request.requestStatus === "pending"
                        ? "bg-yellow-500/10 text-yellow-600"
                        : request.requestStatus === "inprogress"
                          ? "bg-blue-500/10 text-blue-600"
                          : request.requestStatus === "fulfilled"
                            ? "bg-green-500/10 text-green-600"
                            : "bg-red-500/10 text-red-600"
                    }>
                      {request.requestStatus || "Pending"}
                    </Badge>
                  ) : (
                    getStatusBadge(request.donationStatus as DonationStatus)
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(request._id)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    {request.donationStatus === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(request._id)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(request._id)}
                      className="text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No donation requests found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Container>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              donation request from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90">
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AllDonationRequest;
