import LeaveRequestForm from "./LeaveRequestForm";
import LeaveRequestTable from "./LeaveRequestTable";

export default function LeaveManagement() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">
                Leave Approval Management
            </h1>

            {/* Leave Application Form */}
            <LeaveRequestForm />

            {/* Leave Request List */}
            <LeaveRequestTable />
        </div>
    );
}
