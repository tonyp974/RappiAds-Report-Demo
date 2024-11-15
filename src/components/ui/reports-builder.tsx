'use client'
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Bar, AreaChart, Area } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, Download, Calendar, FileText, Brain, BrainCircuit } from 'lucide-react';

const CAMPAIGNS = {
  'Dia de los Muertos': {
    products: ['Sponsored Products', 'Sponsored Brands'],
    dateRange: { 
      start: new Date('2024-10-25'),
      end: new Date('2024-11-02')
    }
  },
  'Dia de Independencia': {
    products: ['Sponsored Products', 'Vertical Banners'],
    dateRange: {
      start: new Date('2024-09-13'),
      end: new Date('2024-09-16')
    }
  },
  'Black Friday': {
    products: ['Sponsored Products', 'Sponsored Brands', 'Vertical Banners'],
    dateRange: {
      start: new Date('2024-11-22'),
      end: new Date('2024-11-24')
    }
  }
};

const DatePresets = {
  'Today': [new Date(), new Date()],
  'Yesterday': [new Date(Date.now() - 86400000), new Date(Date.now() - 86400000)],
  'Last 7 Days': [new Date(Date.now() - 7 * 86400000), new Date()],
  'Last 30 Days': [new Date(Date.now() - 30 * 86400000), new Date()],
  'This Month': [new Date(new Date().setDate(1)), new Date()],
  'Last Month': [new Date(new Date().setMonth(new Date().getMonth() - 1, 1)), new Date(new Date().setDate(0))]
};

export function ReportBuilder() {
  // ... Previous state declarations and logic ...
  // Would you like me to continue with the full implementation?
}