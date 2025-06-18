// src/hooks/useTourBooking.js
import { useState, useEffect, useCallback } from "react";
import { fetchTourDetails, fetchAdditionalServices, submitBooking } from "@/utils/fakeTourBooking.js";

export const useTourBooking = () => {
  const [tourInfo, setTourInfo] = useState(null);
  const [additionalServices, setAdditionalServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [passengerCounts, setPassengerCounts] = useState({
    adult: 2,
    child: 0,
    senior: 0,
  });

  const [passengers, setPassengers] = useState([
    { id: "adult-0", type: "adult", fullName: "", dateOfBirth: undefined, gender: "", phoneNumber: "", singleRoom: false },
    { id: "adult-1", type: "adult", fullName: "", dateOfBirth: undefined, gender: "", phoneNumber: "", singleRoom: false },
  ]);

  const [serviceQuantities, setServiceQuantities] = useState({});
  const [notes, setNotes] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tourData, servicesData] = await Promise.all([fetchTourDetails(), fetchAdditionalServices()]);
        setTourInfo(tourData);
        setAdditionalServices(servicesData);
      } catch (err) {
        setError("Không thể tải dữ liệu tour.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const updatePassengerCount = useCallback((type, increment) => {
    setPassengerCounts(prevCounts => {
      const newCounts = { ...prevCounts };
      if (increment) {
        newCounts[type]++;
      } else if (newCounts[type] > (type === "adult" ? 1 : 0)) {
        newCounts[type]--;
      }

      // Update passengers array based on new counts
      const newPassengers = [];
      let currentPassengerId = 0;

      const createOrUpdatePassenger = (type, existingPassengers) => {
        const existing = existingPassengers.find(p => p.type === type && p.id === `${type}-${currentPassengerId - (prevCounts.adult + prevCounts.child + prevCounts.senior - prevCounts[type])}`); // This logic for ID matching needs refinement for robustness
        return {
          id: `${type}-${currentPassengerId++}`,
          type,
          fullName: existing ? existing.fullName : "",
          dateOfBirth: existing ? existing.dateOfBirth : undefined,
          gender: existing ? existing.gender : "",
          phoneNumber: existing ? existing.phoneNumber : "",
          singleRoom: existing ? existing.singleRoom : false, // For adult/senior
        };
      };

      for (let i = 0; i < newCounts.adult; i++) {
        newPassengers.push(createOrUpdatePassenger("adult", passengers));
      }
      for (let i = 0; i < newCounts.child; i++) {
        newPassengers.push(createOrUpdatePassenger("child", passengers));
      }
      for (let i = 0; i < newCounts.senior; i++) {
        newPassengers.push(createOrUpdatePassenger("senior", passengers));
      }
      setPassengers(newPassengers);
      return newCounts;
    });
  }, [passengers]); // Include passengers in dependency array

  const updatePassenger = useCallback((id, field, value) => {
    setPassengers(prevPassengers =>
      prevPassengers.map(p => (p.id === id ? { ...p, [field]: value } : p))
    );
  }, []);

  const updateServiceQuantity = useCallback((serviceId, increment) => {
    setServiceQuantities(prevQuantities => {
      const current = prevQuantities[serviceId] || 0;
      if (increment) {
        return { ...prevQuantities, [serviceId]: current + 1 };
      } else if (current > 0) {
        return { ...prevQuantities, [serviceId]: current - 1 };
      }
      return prevQuantities;
    });
  }, []);

  const getPassengerPrice = useCallback((type) => {
    if (!tourInfo) return 0;
    switch (type) {
      case "adult":
        return tourInfo.discountedPrice || tourInfo.price;
      case "child":
        return (tourInfo.discountedPrice || tourInfo.price) * 0.8;
      case "senior":
        return (tourInfo.discountedPrice || tourInfo.price) * 0.9;
      default:
        return 0;
    }
  }, [tourInfo]);

  const calculateTotal = useCallback(() => {
    if (!tourInfo) return 0;
    let total = 0;

    // Calculate passenger costs
    total += passengerCounts.adult * getPassengerPrice("adult");
    total += passengerCounts.child * getPassengerPrice("child");
    total += passengerCounts.senior * getPassengerPrice("senior");

    // Calculate additional services
    Object.entries(serviceQuantities).forEach(([serviceId, quantity]) => {
      const service = additionalServices.find((s) => s.id === Number.parseInt(serviceId));
      if (service) {
        total += service.price * quantity;
      }
    });

    const totalPassengers = passengerCounts.adult + passengerCounts.child + passengerCounts.senior;
    const hasGroupDiscount = totalPassengers >= 10;
    if (hasGroupDiscount) {
      total *= 0.9; // Apply 10% discount for groups of 10 or more
    }

    return total;
  }, [tourInfo, passengerCounts, serviceQuantities, additionalServices, getPassengerPrice]);

  const isFormValid = useCallback(() => {
    const requiredPassengers = passengerCounts.adult + passengerCounts.child + passengerCounts.senior;
    const validPassengers = passengers.filter(
      (p) => p.fullName.trim() !== "" && p.gender !== "" && p.dateOfBirth !== undefined,
    ).length;

    return validPassengers >= requiredPassengers && agreeTerms;
  }, [passengerCounts, passengers, agreeTerms]);

  const handleSubmitBooking = async () => {
    if (!isFormValid()) {
      alert("Vui lòng điền đầy đủ thông tin hành khách bắt buộc và đồng ý với điều khoản.");
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        tourId: tourInfo.id,
        passengerCounts,
        passengers,
        serviceQuantities,
        notes,
        totalAmount: calculateTotal(),
        subscribeNewsletter,
      };
      const response = await submitBooking(bookingData);
      alert(response.message);
      // Optionally reset form or redirect
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };


  return {
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
  };
};