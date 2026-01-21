import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary";

type BaseProps = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

type ButtonAsButtonProps = BaseProps &
  Omit<ComponentProps<"button">, "className" | "children"> & {
    href?: never;
  };

type ButtonAsAnchorProps = BaseProps &
  Omit<ComponentProps<"a">, "className" | "children"> & {
    href: string;
  };

export function Button(props: ButtonAsButtonProps | ButtonAsAnchorProps) {
  const variant = props.variant || "secondary";
  const cls = `button${variant === "primary" ? " primary" : ""}${props.className ? ` ${props.className}` : ""}`;

  if (typeof (props as any).href === "string") {
    const { variant: _v, className: _c, children, ...rest } = props as ButtonAsAnchorProps;
    return (
      <a {...rest} className={cls}>
        {children}
      </a>
    );
  }

  const { variant: _v, className: _c, children, ...rest } = props as ButtonAsButtonProps;
  return (
    <button {...rest} className={cls}>
      {children}
    </button>
  );
}

