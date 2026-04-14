"use client";

import type React from "react";

type KeyboardTarget = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export const focusNextFieldOnEnter = (
  e: React.KeyboardEvent<KeyboardTarget>,
): void => {
  if (e.key !== "Enter" || e.shiftKey) return;

  const target = e.currentTarget;
  const form = target.form;
  const navigationScope =
    form ?? target.closest<HTMLElement>("[data-enter-navigation]");
  if (!navigationScope) return;

  // Keep Enter behavior for textarea multiline editing.
  if (target instanceof HTMLTextAreaElement) return;

  const fields = Array.from(
    navigationScope.querySelectorAll<HTMLElement>(
      "input:not([type='hidden']):not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled])",
    ),
  ).filter((el) => el.tabIndex !== -1);

  const index = fields.indexOf(target);
  if (index === -1) return;

  e.preventDefault();

  const nextField = fields[index + 1];
  if (nextField) {
    nextField.focus();
    return;
  }

  if (form) {
    form.requestSubmit();
  }
};
