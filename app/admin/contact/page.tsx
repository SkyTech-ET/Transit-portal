"use client";

import React, { useEffect } from "react";
import { useContactStore } from "@/modules/contact";
import ContactTable from "./components/ContactTable";
const ContactPage = () => {
  const { contacts,  loading, getContacts } = useContactStore();

  useEffect(() => {
     getContacts()
  }, [getContacts])

  return (
    <div className="flex flex-col gap-4 rounded-md bg-white py-6">
      <ContactTable
        loading={loading}
        contacts={contacts}
      />
    </div>
  );
};

export default ContactPage;
