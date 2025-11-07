'use client';

import { useStakeholders } from '@/hooks/useStakeholders';
import React, { useEffect, useState } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import { supabase, Stakeholder } from '@/lib/supabase';
import 'react-map-gl/dist/style.css';
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function InteractiveMap() {
    const { stakeholders, loading } = useStakeholders();
    const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);

  return (
        <div className="relative w-full h-screen">
