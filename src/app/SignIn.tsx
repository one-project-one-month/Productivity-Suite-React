import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PasswordInput } from '@/components/password-input';
import { toast } from 'sonner';
import RequiredStar from '@/components/required-star';
import { useMutation } from '@tanstack/react-query';
import { signIn } from '@/api/auth';
import { assignLoginToken } from '@/lib/auth';
import { useAuthDataStore } from '@/store/useAuthStore';
import { LoaderPinwheel } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email().trim().nonempty('Email required'),
  password: z.string().trim().nonempty('Password required'),
});

export type SignInType = z.infer<typeof formSchema>;

const SignIn = () => {
  const navigate = useNavigate();
  const setUser = useAuthDataStore((state) => state.setUser);

  const form = useForm<SignInType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: SignInType) =>
      await signIn(data)
        .then((response) => {
          if (response.data.code === 200) {
            assignLoginToken(
              response.data.data.accessToken,
              response.data.data.accessToken
            );
            setUser(response.data.data.currentUser);
            toast.success('Success Login!');
            navigate('/app/pomodoro-timer');
            form.reset();
            return response.data;
          }
        })
        .catch((e) => {
          if (e.response?.data?.code === 401) {
            toast.error(
              e.response.data.message ??
                'Invalid credentials, please try again.'
            );
          } else {
            toast.error('Login failed, please try again.');
          }
          throw e;
        }),
  });

  const onSubmit = (values: SignInType) => {
    mutateAsync(values);
  };

  return (
    <div className="h-[calc(100vh-380px)] flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-lg">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center font-bold">
                Login to your account
              </CardTitle>
              <CardDescription className="text-center">
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="flex flex-col gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="">
                          <FormLabel htmlFor="email">
                            Email
                            <RequiredStar />
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={form.formState.isSubmitting}
                              id="email"
                              placeholder="Email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Password <RequiredStar />
                          </FormLabel>
                          <FormControl>
                            <PasswordInput placeholder="Password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-indigo-500 hover:bg-indigo-600"
                    >
                      {isPending ? (
                        <span className="animate-spin">
                          <LoaderPinwheel />
                        </span>
                      ) : (
                        'Sign in'
                      )}
                    </Button>
                  </div>
                  <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{' '}
                    <Link to="/signup" className="underline underline-offset-4">
                      Sign up
                    </Link>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
