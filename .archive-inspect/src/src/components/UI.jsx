import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiChevronDown, FiX, FiCheck } from "react-icons/fi";

// 1. Premium Button
export const Button = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
  disabled = false,
  type = "button",
}) => {
  const baseStyle =
    "inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 border focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-(--color-primary) text-(--color-primary-50) border-(--color-primary) hover:bg-(--color-primary-hover) hover:border-(--color-primary-hover) shadow-(--shadow-soft)",

    secondary:
      "bg-(--color-surface-2) text-(--color-text) border-(--color-border) hover:bg-(--color-primary-100)",

    success:
      "bg-(--color-success-bg) text-(--color-success) border-transparent hover:brightness-95",

    danger:
      "bg-(--color-danger-bg) text-(--color-danger) border-transparent hover:brightness-95",

    outline:
      "bg-transparent border-(--color-border) text-(--color-text) hover:bg-(--color-primary-100)",

    ghost:
      "bg-transparent text-(--color-text-secondary) border-transparent hover:bg-(--color-primary-100)",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };

  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.97 }}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

// 2. Card Container
export const Card = ({
  children,
  className = "",
  onClick,
  hover = false,
}) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={
        hover
          ? {
            y: -5,
            transition: { duration: 0.2 },
          }
          : {}
      }
      className={`
        bg-(--color-surface)
        border
        border-(--color-border)
        rounded-3xl
        shadow-(--shadow-soft)
        p-6
        transition-all
        duration-300
        ${hover
          ? "hover:shadow-(--shadow-hover) hover:border-(--color-primary-300) cursor-pointer"
          : ""
        }
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

// 3. Stat Card (For dashboards)
export const StatCard = ({
  title,
  value,
  change,
  changeType = "up",
  icon: Icon,
  className = "",
}) => {
  return (
    <Card hover className={`flex justify-between items-start ${className}`}>
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-(--color-text-muted) font-semibold">
          {title}
        </p>

        <h3 className="text-3xl font-bold text-(--color-text)">
          {value}
        </h3>

        {change && (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${changeType === "up"
              ? "bg-(--color-success-bg) text-(--color-success)"
              : changeType === "down"
                ? "bg-(--color-danger-bg) text-(--color-danger)"
                : "bg-(--color-primary-100) text-(--color-text-secondary)"
              }`}
          >
            {change}
          </span>
        )}
      </div>

      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-primary-100)">
          <Icon className="h-6 w-6 text-(--color-primary)" />
        </div>
      )}
    </Card>
  );
};

// 4. Badges
export const Badge = ({
  children,
  variant = "primary",
}) => {
  const variants = {
    primary:
      "bg-(--color-primary-100) text-(--color-primary)",

    success:
      "bg-(--color-success-bg) text-(--color-success)",

    warning:
      "bg-(--color-warning-bg) text-(--color-warning)",

    danger:
      "bg-(--color-danger-bg) text-(--color-danger)",

    info:
      "bg-(--color-info-bg) text-(--color-info)",

    neutral:
      "bg-(--color-surface-2) text-(--color-text-secondary)",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variants[variant]}`}
    >
      {children}
    </span>
  );
};

// 5. Avatar Component
export const Avatar = ({
  src,
  name = "",
  size = "md",
  className = "",
}) => {
  const sizes = {
    sm: "w-9 h-9 text-xs",
    md: "w-11 h-11 text-sm",
    lg: "w-16 h-16 text-lg",
    xl: "w-24 h-24 text-3xl",
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div
      className={`
        ${sizes[size]}
        rounded-full
        overflow-hidden
        flex
        items-center
        justify-center
        shrink-0
        font-semibold
        bg-(--color-primary-100)
        border
        border-(--color-border)
        text-(--color-primary)
        shadow-(--shadow-soft)
        ${className}
      `}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        getInitials(name)
      )}
    </div>
  );
};

// 6. Modal overlay container
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className = "",
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50"
          />

          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 pointer-events-none">

            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: .3
                }
              }}
              exit={{ opacity: 0, y: 80 }}
              className={`
                w-full
                md:max-w-xl
                rounded-t-3xl
                md:rounded-3xl
                bg-(--color-surface)
                border
                border-(--color-border)
                shadow-(--shadow-hover)
                p-6
                pointer-events-auto
                max-h-[90vh]
                flex
                flex-col
                ${className}
              `}
            >

              <div className="flex items-center justify-between pb-5 border-b border-(--color-border)">

                <h2 className="text-xl font-bold text-(--color-text)">
                  {title}
                </h2>

                <button
                  onClick={onClose}
                  className="
                    w-10
                    h-10
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    hover:bg-(--color-primary-100)
                    transition
                  "
                >
                  <FiX className="text-(--color-text-secondary)" />
                </button>

              </div>

              <div className="flex-1 overflow-y-auto pt-5 no-scrollbar">
                {children}
              </div>

            </motion.div>

          </div>
        </>
      )}
    </AnimatePresence>
  );
};

// 7. Accordion (For Workout Levels management)
export const Accordion = ({
  title,
  children,
  badge = null,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-(--color-surface) border border-(--color-border) rounded-3xl overflow-hidden shadow-(--shadow-soft) mb-4">

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex justify-between items-center hover:bg-(--color-primary-100) transition"
      >

        <div className="flex items-center gap-3">

          <span className="font-semibold text-(--color-text)">
            {title}
          </span>

          {badge}

        </div>

        <motion.div
          animate={{
            rotate: isOpen ? 180 : 0,
          }}
          transition={{
            duration: .2,
          }}
          className="
            w-10
            h-10
            rounded-xl
            bg-(--color-primary-100)
            flex
            items-center
            justify-center
          "
        >
          <FiChevronDown className="text-(--color-text-secondary)" />
        </motion.div>

      </button>

      <AnimatePresence>

        {isOpen && (

          <motion.div
            initial={{
              height: 0,
            }}
            animate={{
              height: "auto",
            }}
            exit={{
              height: 0,
            }}
          >

            <div className="px-6 pb-6 border-t border-(--color-border) bg-(--color-primary-50)">

              {children}

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
};

// 8. Search Bar
export const SearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
}) => {
  return (
    <div className="relative w-full">

      <FiSearch
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-(--color-text-muted)
          text-lg
        "
      />

      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type="text"
        className="
          w-full
          pl-12
          pr-4
          py-3.5
          rounded-2xl
          bg-(--color-surface)
          border
          border-(--color-border)
          text-(--color-text)
          placeholder:text-(--color-text-muted)
          focus:outline-none
          focus:border-(--color-primary)
          transition
          shadow-(--shadow-soft)
        "
      />

    </div>
  );
};
