import { FieldValues, useForm } from "react-hook-form";
import LayoutAuth from "../../components/LayoutAuth";
import { account } from "../../config";
import { toast } from "sonner";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    const { email, password } = data;

    try {
      await account.createEmailPasswordSession(email, password);
      toast.success(`Login success`);
      reset();
      window.location.href = "/";
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error?.message);
      }
    }
  };

  return (
    <LayoutAuth title="Login">
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 py-2 px-4 w-full text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
        >
          Login
        </button>
      </form>
    </LayoutAuth>
  );
}
