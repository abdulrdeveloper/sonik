export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const styles = {
    primary: "bg-ink text-paper hover:bg-[#30433c]",
    lime: "bg-lime text-ink hover:bg-[#bddd58]",
    outline:
      "border border-line bg-transparent text-ink hover:border-ink hover:bg-paper",
    ghost: "text-sage hover:bg-[#eaeade] hover:text-ink",
  };

  return (
    <button
      className={`inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-full px-4 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
