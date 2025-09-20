"use client"
import React from "react";
import styles from "./CVBUTTON.module.css"
import { motion } from "framer-motion";
export default function CVButton({
  href = "/Abdullah-Khazana-Katbi-CV.pdf",
  downloadName = "Abdullah-Khazana-Katbi-CV.pdf",

  iconOnly = false,
  className = "tracking-widest group",
}) {
  const ariaProps = iconOnly ? { "aria-label": "Download CV" } : {};

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      download={downloadName}
      {...ariaProps}
      className={` ${className}`}
    >
      {!iconOnly && (
        <div className="flex">
          <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={styles.button}
          >
            Download CV
          </motion.button>
        </div>
      )}
    </a>
  );
}
