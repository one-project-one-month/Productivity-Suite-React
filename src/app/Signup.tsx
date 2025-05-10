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
import { Link } from 'react-router';
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
import { objectToArray } from '@/lib/dataUtils';
import { GENDER } from '@/app/constant';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z
  .object({
    name: z.string().trim().nonempty('Name required'),
    username: z.string().trim().nonempty('Username required'),
    email: z.string().email().trim().nonempty('Email required'),
    gender: z.string().nonempty('Gender required'),
    password: z
      .string()
      .trim()
      .nonempty('Password required')
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must contain at least one capital letter')
      .regex(/\d/, 'Password must contain at least one number')
      .regex(
        /[@$!%*?&]/,
        'Password must contain at least one special character'
      ),
    confirmPassword: z.string().trim().nonempty('Confirm Password required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match with Password',
    path: ['confirmPassword'],
  });

type SignUpType = z.infer<typeof formSchema>;

const SignUp = () => {
  const genderList = objectToArray(GENDER);

  const form = useForm<SignUpType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      gender: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: SignUpType) => {
    console.log(values, 'Form Values');
    toast.success('Success Sign Up!');
    form.reset();
  };

  return (
    <div className="h-fit flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-lg">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center font-bold">
                Create an account
              </CardTitle>
              <CardDescription className="text-center">
                Enter your details below to create your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="flex flex-col gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Full Name <RequiredStar />
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Full Name"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            User Name <RequiredStar />
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="User Name"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Gender <RequiredStar />
                          </FormLabel>
                          <Select
                            value={field.value?.toString()}
                            onValueChange={(value) => field.onChange(value)}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {genderList.map((gender) => (
                                <SelectItem
                                  value={gender.value.toString()}
                                  key={gender.key}
                                >
                                  {gender.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Password <RequiredStar />
                          </FormLabel>
                          <FormControl>
                            <PasswordInput
                              placeholder="Confirm Password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-indigo-500 hover:bg-indigo-600"
                    >
                      Sign up
                    </Button>
                  </div>
                  <div className="mt-4 text-center text-sm">
                    Already have account?{' '}
                    <Link to="/signin" className="underline underline-offset-4">
                      Sign In
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

export default SignUp;
