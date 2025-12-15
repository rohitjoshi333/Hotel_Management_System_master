import React from "react";

interface InvoiceProps {
    bookingDetails: {
        bookingId?: number;
        status?: string;
        roomNumber?: string | number;
        fullName: string;
        streetAddress: string;
        streetAddress2: string;
        state: string;
        postalCode: string;
        phone: string;
        email: string;
        arrivalDateTime: string;
        departureDateTime: string;
        room: string;
        guests: number;
        paymentMethod: string;
        specialRequest: string;
    };
}

const Invoice: React.FC<InvoiceProps> = ({ bookingDetails }) => {
    return (
        <div className="p-6 bg-white shadow-lg rounded-xl space-y-6 max-w-3xl mx-auto mt-25 capitalize">
            <h2 className="text-2xl font-bold mb-4">Booking Invoice</h2>
            <div className="space-y-2">
                {bookingDetails.bookingId && (
                    <p><strong>Booking ID:</strong> {bookingDetails.bookingId}</p>
                )}
                {bookingDetails.status && (
                    <p><strong>Status:</strong> {bookingDetails.status}</p>
                )}
                {bookingDetails.roomNumber && (
                    <p><strong>Room Number:</strong> {bookingDetails.roomNumber}</p>
                )}
                <p><strong>Full Name:</strong> {bookingDetails.fullName}</p>
                <p><strong>Address:</strong> {bookingDetails.streetAddress} {bookingDetails.streetAddress2}</p>
                <p><strong>State / ZIP:</strong> {bookingDetails.state}, {bookingDetails.postalCode}</p>
                <p><strong>Phone:</strong> {bookingDetails.phone}</p>
                <p>
                    <strong>Email:</strong>{" "}
                    <span className="lowercase">{bookingDetails.email}</span>
                </p>
                <p><strong>Room Type:</strong> {bookingDetails.room}</p>
                <p><strong>Guests:</strong> {bookingDetails.guests}</p>
                <p><strong>Arrival:</strong> {bookingDetails.arrivalDateTime}</p>
                <p><strong>Departure:</strong> {bookingDetails.departureDateTime}</p>
                <p><strong>Payment Method:</strong> {bookingDetails.paymentMethod}</p>
                {bookingDetails.specialRequest && (
                    <p><strong>Special Request:</strong> {bookingDetails.specialRequest}</p>
                )}
            </div>
        </div>
    );
};

export default Invoice;
