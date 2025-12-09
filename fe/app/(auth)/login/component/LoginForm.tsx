"use client";

import { Form, Input, Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import PasswordInput from '@/components/ui/PasswordInput'

export default function LoginForm() {
  const router = useRouter();
  const t = useTranslations("LoginPage");

  return (
    <div className="w-1/2 pl-6 flex flex-col justify-center">
      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        {t("login")}
      </h2>
      <Form className="flex flex-col gap-4">
        <Input
          isRequired
          label={t("form.username")}
          placeholder={t("form.usernamePlaceholder")}
          labelPlacement="outside"
        />

        <PasswordInput
          isRequired
          label={t("form.password")}
          placeholder={t("form.passwordPlaceholder")}
          type="password"
          labelPlacement="outside"
        />

        <div className="flex gap-3 mt-1">
          <Button color="primary" type="submit">
            {t("form.loginButton")}
          </Button>

          <Button color="default" variant="bordered">
            {t("form.cancelButton")}
          </Button>
        </div>
      </Form>
    </div>
  );
}
