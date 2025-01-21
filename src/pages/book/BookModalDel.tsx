import React, { useState } from "react";
import { IBook } from "../../types";
import { collBookId, databases, dbId } from "../../config";
import { toast } from "sonner";

interface BookModalDelProps {
  i: number;
  book: IBook;
  openModalDel: number | null;
  setOpenModalDel: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function BookModalDel({ i, book, openModalDel, setOpenModalDel }: BookModalDelProps) {
  const [pending, setPending] = useState(false);

  const onDelete = async () => {
    setPending(true);
    databases
      .deleteDocument(dbId, collBookId, book.$id)
      .then(() => {
        toast.success(`Deleted book: ${book.title}`);
        setOpenModalDel(null);
      })
      .catch((err) => {
        toast.error(`Failed to delete book: ${err.message}`);
      })
      .finally(() => setPending(false));
  };

  return (
    <div
      onClick={() => setOpenModalDel(null)}
      className={`${
        openModalDel === i ? "opacity-100 visible" : "opacity-0 invisible"
      } transition-all duration-300 fixed inset-0 px-4 z-50 bg-gray-500/5`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${
          openModalDel === i ? "translate-y-0" : "-translate-y-8"
        } transition-all max-w-lg w-full border rounded-lg mx-auto bg-white mt-32 p-6`}
      >
        <div>
          <p>Delete {book?.title}, Are you sure?</p>
          <div className="flex gap-4 mt-4">
            <button type="button" onClick={onDelete} className="text-red-500 hover:underline">
              {pending ? "Deleting..." : "Delete"}
            </button>
            <button type="button" className="hover:underline" onClick={() => setOpenModalDel(null)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
