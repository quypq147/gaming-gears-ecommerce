"use client";

import React from "react";
import { motion } from "framer-motion";

export default function TestMotion() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <p>This is a test of Framer Motion!</p>
    </motion.div>
  );
}
