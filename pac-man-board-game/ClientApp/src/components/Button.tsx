import React from "react";

export const Button: Component<ButtonProps> = (
  {
    className,
    onClick,
    style,
    title,
    id,
    disabled = false,
    children,
    type = "button",
  }) => {
  return (
    <button
      id={id}
      className={`button-default ${className}`}
      style={style}
      disabled={disabled}
      type={type}
      title={title}
      onClick={onClick}>
      {children}
    </button>
  )
}