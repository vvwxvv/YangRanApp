"use client";
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from "@/components/contexts/LanguageContext";
import ReorderLayout from "@/components/layouts/ReorderLayout";
import { enquireReorderConfig } from "@/components/configs/reorderConfigs"; // Make sure to export enquireReorderConfig in this file

function EnquireReorderManager() {
  const { isCn } = useContext(LanguageContext);
  
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch enquiries from API
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/enquire/reorder');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setEnquiries(data);
      } catch (err) {
        console.log('Error fetching enquiries:', err);
        setError('Failed to load enquiries. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  // Handle edit
  const handleEdit = (id) => {
    // Navigate to edit page
    window.location.href = `/manager/enquire/${id}/edit`;
  };

  // Save reordered enquiries to database
  const handleSave = async (newEnquiries) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      const orderedIds = newEnquiries.map(enquiry => enquiry._id || enquiry.id);
      
      const response = await fetch('/api/enquire/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderedIds }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        setSuccess(true);
        // Update local state with new order values (assuming you add an 'order' field for manual sorting)
        setEnquiries(newEnquiries.map((enquiry, index) => ({
          ...enquiry,
          order: String(index + 1) 
        })));
        
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(result.error || 'Failed to save order');
      }
    } catch (err) {
      console.log('Error saving enquiry order:', err);
      setError('Failed to save order. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ReorderLayout
      config={enquireReorderConfig}
      data={enquiries}
      onSave={handleSave}
      onEdit={handleEdit}
      loading={loading}
      saving={saving}
      error={error}
      success={success}
    />
  );
}

export default EnquireReorderManager;