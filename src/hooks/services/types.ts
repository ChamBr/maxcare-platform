import { z } from "zod";

export const serviceFormSchema = z.object({
  serviceType: z.string().min(1, "Por favor selecione um tipo de serviço"),
  notes: z.string().optional(),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;