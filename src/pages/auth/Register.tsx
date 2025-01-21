import { FieldValues, useForm } from "react-hook-form";
import LayoutAuth from "../../components/LayoutAuth";
import { account, uniqueId } from "../../config";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const signUpSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email(),
    password: z.string().min(3, "Password must be at least 3 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });

type SignUpSchema = z.infer<typeof signUpSchema>;

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    // getValues,
    // setError,
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data: FieldValues) => {
    const { name, email, password } = data;

    try {
      await account.create(uniqueId(), email, password, name);
      toast.success(`Register ${name} success`);
      reset();
      navigate("/login");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error?.message);
      }
    }
  };

  return (
    <LayoutAuth title="Register">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="name">Name</label>
          <input
            {...register("name")}
            id="name"
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Your name"
          />
          {errors.name && <p className="text-red-500">{`${errors.name.message}`}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            {...register("email")}
            id="email"
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Email"
          />
          {errors.email && <p className="text-red-500">{`${errors.email.message}`}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            {...register("password")}
            id="password"
            type="password"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="******"
          />
          {errors.password && <p className="text-red-500">{`${errors.password.message}`}</p>}
        </div>
        <div className="mb-6">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            {...register("confirmPassword")}
            id="confirmPassword"
            type="password"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="******"
          />
          {errors.confirmPassword && <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 py-2 px-4 w-full text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
        >
          Register
        </button>
      </form>
    </LayoutAuth>
  );
}
