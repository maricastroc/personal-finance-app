/* eslint-disable react-hooks/exhaustive-deps */
import { PrimaryButton } from "@/components/core/PrimaryButton";
import { api } from "@/lib/axios";
import { formatToDollar } from "@/utils/formatToDollar";
import { handleApiError } from "@/utils/handleApiError";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "phosphor-react";
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
        currentAmount: newAmount,
      };

      const response = await api.put(`/pots/${id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success(response.data.message);
      await onSubmitForm();
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
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[990] bg-black bg-opacity-70" />

      <Dialog.Content
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-pot-title"
        className="fixed z-[999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] bg-white rounded-lg shadow-lg p-6 md:w-[560px] md:p-8 outline-none"
      >
        <Dialog.Close
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-grey-900 hover:text-white transition-all duration-300 text-grey-500 p-[0.1rem] rounded-full border border-grey-900"
        >
          <X size={16} aria-hidden="true" />
          <span className="sr-only">Close modal</span>
        </Dialog.Close>

        <Dialog.Title
          id="edit-pot-title"
          className="text-xl max-w-[90%] font-semibold text-grey-900 mb-2 md:text-2xl"
        >
          {isWithdraw ? `Withdraw from '${name}'` : `Add to '${name}'`}
        </Dialog.Title>

        <Dialog.Description className="flex flex-col w-full text-sm text-grey-500">
          {isWithdraw
            ? "Withdraw from your pot to put money back in your main balance. This will reduce the amount you have in this pot."
            : "Add money to your pot to increase your savings. This will add to the amount you have in this pot."}
        </Dialog.Description>

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
              borderTopLeftRadius: "0.45rem",
              borderBottomLeftRadius: "0.45rem",
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
              borderTopRightRadius: "0.45rem",
              borderBottomRightRadius: "0.45rem",
              transition: "width 0.3s ease, left 0.3s ease",
              borderLeft: "3px solid white",
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

        <div className="flex flex-col mt-8">
          <label
            htmlFor="pot-amount-input"
            className="text-xs font-bold text-grey-500 mb-1"
          >
            {isWithdraw ? "Amount to Withdraw ($)" : "Amount to Add ($)"}
          </label>

          <div className="relative w-full">
            <span className="absolute inset-y-0 left-3 flex items-center text-grey-500">
              $
            </span>

            <input
              id="pot-amount-input"
              type="number"
              step="0.01"
              className="text-sm w-full h-12 rounded-md border border-beige-500 pl-[1.8rem] pr-3"
              placeholder="Enter amount"
              onChange={(e) => setInputValue(Number(e.target.value) || 0)}
            />
          </div>
        </div>

        <PrimaryButton onClick={handleEditPot} isSubmitting={isSubmitting}>
          Save Changes
        </PrimaryButton>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
