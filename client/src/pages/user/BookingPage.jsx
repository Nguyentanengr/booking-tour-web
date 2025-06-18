// BookingPage.jsx
import React from "react";
import { useTourBooking } from "@/hooks/useTourBooking";
import { PassengerCountSelection } from "@/components/tour-booking/PassengerCountSelection";
import { PassengerInformationForm } from "@/components/tour-booking/PassengerInformationForm";
import { AdditionalServicesSelection } from "@/components/tour-booking/AdditionalServicesSelection";
import { NotesSection } from "@/components/tour-booking/NotesSection";
import { PaymentInfoAndTerms } from "@/components/tour-booking/PaymentInfoAndTerms";
import { OrderSummary } from "@/components/tour-booking/OrderSummary";
import { Separator } from "@/components/ui/separator";


export default function BookingPage() {
  const {
    tourInfo,
    additionalServices,
    loading,
    error,
    passengerCounts,
    passengers,
    serviceQuantities,
    notes,
    agreeTerms,
    subscribeNewsletter,
    updatePassengerCount,
    updatePassenger,
    updateServiceQuantity,
    setNotes,
    setAgreeTerms,
    setSubscribeNewsletter,
    getPassengerPrice,
    calculateTotal,
    isFormValid,
    handleSubmitBooking,
  } = useTourBooking();

  if (loading) {
    return <div className="container py-8 text-center">Đang tải thông tin tour...</div>;
  }

  if (error) {
    return <div className="container py-8 text-center text-red-600">Lỗi: {error}</div>;
  }

  return (
    <div className="container py-8 w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-2xl font-bold mb-2 text-blue-600">Đặt tour</h1>
            <p className="text-gray-600">{tourInfo.name}</p>
          </div>

          <PassengerCountSelection
            passengerCounts={passengerCounts}
            updatePassengerCount={updatePassengerCount}
          />

          <PassengerInformationForm
            passengerCounts={passengerCounts}
            passengers={passengers}
            updatePassenger={updatePassenger}
            getPassengerPrice={getPassengerPrice}
          />

          <AdditionalServicesSelection
            additionalServices={additionalServices}
            serviceQuantities={serviceQuantities}
            updateServiceQuantity={updateServiceQuantity}
          />

          <NotesSection notes={notes} setNotes={setNotes} />

          <PaymentInfoAndTerms
            agreeTerms={agreeTerms}
            setAgreeTerms={setAgreeTerms}
            subscribeNewsletter={subscribeNewsletter}
            setSubscribeNewsletter={setSubscribeNewsletter}
          />
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary
            tourInfo={tourInfo}
            passengerCounts={passengerCounts}
            additionalServices={additionalServices}
            serviceQuantities={serviceQuantities}
            getPassengerPrice={getPassengerPrice}
            calculateTotal={calculateTotal}
            isFormValid={isFormValid}
            handleSubmitBooking={handleSubmitBooking}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}