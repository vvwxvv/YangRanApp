"use client";
import { useContext } from 'react';
import { DeviceContext } from '@/components/contexts/DeviceContext';
import ContactPageComponent from '@/components/pages/contact/ContactPageComponent';

export default function ContactPage() {

  const { isMobile } = useContext(DeviceContext);


  return (
    <div style={{marginTop:isMobile ?"-400px":"-350px",padding:isMobile ? "30px" : "0"}}>
  <ContactPageComponent />
  </div>
  )
  ;
}