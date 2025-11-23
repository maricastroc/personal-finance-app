/* eslint-disable react-hooks/exhaustive-deps */
import { CurrencyInput } from "@/components/core/CurrencyInput";
import { PrimaryButton } from "@/components/core/PrimaryButton";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Modal } from "@/components/shared/Modal";
import { useBalance } from "@/contexts/BalanceContext";
import { api } from "@/lib/axios";
import { formatToDollar } from "@/utils/formatToDollar";
import { handleApiError } from "@/utils/handleApiError";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface EditPotAmountModalProps {
  name: string;
  id: string;
  currentAmount: number;
  targetAmount: number;
  themeColor: string;
  originalPercentage: number;
  isWithdraw?: boolean;
  onClose: () => void;
  onSubmitForm: () => void | Promise<void>;
}

export function EditPotAmountModal({
  onClose,
  onSubmitForm,
  id,
  name,
  currentAmount,
  targetAmount,
  themeColor,
  originalPercentage,
  isWithdraw = false,
}: EditPotAmountModalProps) {
  const [inputValue, setInputValue] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { refetchBalance } = useBalance();

  const modalTitle = isWithdraw
    ? `Withdraw from '${name}'`
    : `Add to '${name}'`;

  const modalDescription = isWithdraw
    ? "Withdraw from your pot to put money back in your balance. This will reduce the amount you have in this pot."
    : "Add money to your pot to increase your savings. This will add to the amount you have in this pot.";

  const [calculatedValues, setCalculatedValues] = useState({
    inputPercentage: 0,
    newPercentage: originalPercentage,
    newAmount: currentAmount,
  });

  useEffect(() => {
    const amount = Math.max(0, inputValue || 0);

    const inputPercentage = Math.min(100, (amount / targetAmount) * 100);

    const newAmount = isWithdraw
      ? currentAmount - amount
      : currentAmount + amount;

    const newPercentage = Math.max(
      0,
      Math.min(100, (newAmount / targetAmount) * 100)
    );

    setCalculatedValues({
      inputPercentage,
      newPercentage,
      newAmount,
    });
  }, [inputValue, currentAmount, isWithdraw, targetAmount]);

  const { inputPercentage, newPercentage, newAmount } = calculatedValues;

  const handleEditPot = async () => {
    try {
      setIsSubmitting(true);

      const payload = {
        name,
        themeColor,
        targetAmount,
        currentAmount: newAmount || 0,
      };

      const response = await api.put(`/pots/${id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success(response.data.message);
      await onSubmitForm();
      await refetchBalance();

      onClose();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setInputValue(0);
    setCalculatedValues({
      inputPercentage: 0,
      newPercentage: originalPercentage,
      newAmount: currentAmount,
    });
  }, [onClose]);

  return (
    <Modal
      id={id}
      title={modalTitle}
      description={modalDescription}
      onClose={onClose}
    >
      <div className="flex flex-col w-full mt-6">
        <div className="flex items-center justify-between w-full">
          <p className="text-grey-500 text-sm">New Amount</p>
          <h2 className="text-3xl font-bold">{formatToDollar(newAmount)}</h2>
        </div>
      </div>

      <div className="mt-4 w-full h-[0.9rem] bg-beige-100 rounded-full relative overflow-hidden">
        <div
          className="absolute h-full"
          style={{
            width: `${
              isWithdraw
                ? originalPercentage - inputPercentage
                : originalPercentage
            }%`,
            backgroundColor: themeColor,
            transition: "width 0.3s ease",
          }}
        />

        <div
          className={`absolute h-full ${
            isWithdraw ? "bg-secondary-red" : "bg-secondary-green"
          }`}
          style={{
            width: `${inputPercentage}%`,
            left: isWithdraw
              ? `calc(${originalPercentage}% - ${inputPercentage}%)`
              : `${originalPercentage}%`,
            transition: "width 0.3s ease, left 0.3s ease",
            borderLeft: "3px solid white",
            borderTopLeftRadius:
              currentAmount === 0 || newAmount === 0 ? "0.45rem" : "",
            borderBottomLeftRadius:
              currentAmount === 0 || newAmount === 0 ? "0.45rem" : "",
          }}
        />
      </div>

      <div className="flex flex-col w-full mt-3">
        <div className="flex items-center justify-between w-full">
          <p className="text-grey-500 font-bold text-xs">
            {newPercentage.toFixed(2)}%
          </p>
          <p className="text-grey-500 text-xs">{`Target of ${formatToDollar(
            targetAmount
          )}`}</p>
        </div>
      </div>

      <div className="flex flex-col mt-8 gap-1">
        <CurrencyInput
          label={isWithdraw ? "Amount to Withdraw" : "Amount to Add"}
          value={inputValue}
          onValueChange={setInputValue}
          placeholder="0.00"
          id="pot-amount-input"
        />

        {newAmount < 0 && (
          <ErrorMessage
            id="amount-error"
            message="Withdrawal amount exceeds available balance. Please enter a lower amount."
          />
        )}
      </div>

      <PrimaryButton
        disabled={newAmount < 0}
        className="mt-8"
        onClick={handleEditPot}
        isSubmitting={isSubmitting}
      >
        Save Changes
      </PrimaryButton>
    </Modal>
  );
}
