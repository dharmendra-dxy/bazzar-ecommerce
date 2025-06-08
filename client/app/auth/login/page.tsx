'use client'

import { protectLoginAction } from '@/actions/auth.action'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/useAuth.store'
import { Label } from '@radix-ui/react-dropdown-menu'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

const LoginPage = () => {

    const router = useRouter();
    const { login, isLoading, error } = useAuthStore();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    }

    // handleFormSubmit:
    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // check first level of validation for login:
        const checkFirstValidation = await protectLoginAction(formData.email);

        if (!checkFirstValidation.success) {
            toast.error(checkFirstValidation?.error);
            return;
        }

        // login api calling:
        const loginSuccess = await login(formData.email, formData.password);
        if (loginSuccess) {

            // get user from store:
            const user = useAuthStore?.getState()?.user;
            if(user?.role==='SUPER_ADMIN') router.push('/super-admin');
            else router.push('/home');

            toast.success('User Logged in sucessfully');
        }
        else {
            toast.error(error);
        }
    }

    return (
        <div className='min-h-screen bg-[#fff6f4] flex'>
            <div className='hidden lg:block w-1/2 bg-[#ffede1] relative overflow-hidden'>
                <Image
                    src="https://images.unsplash.com/photo-1525909002-1b05e0c869d8?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt='register'
                    fill
                    className='object-cover'
                />
            </div>
            <div className='w-full lg:w-1/2 flex flex-col p-8 lg:p-16 justify-center'>
                <div className='max-w-md w-full mx-auto'>
                    <div className='flex justify-center'>
                        <Image
                            src='https://images.unsplash.com/photo-1602934445884-da0fa1c9d3b3?q=80&w=2158&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                            alt='logo'
                            width={50}
                            height={50}
                            className='rounded-full'
                        />
                    </div>

                    <form className='space-y-4' onSubmit={handleFormSubmit}>
                        <div className='space-y-1'>
                            <Label>Email</Label>
                            <Input
                                id='email'
                                name='email'
                                type='text'
                                placeholder='Enter your email'
                                required
                                value={formData.email}
                                onChange={handleOnChange}
                            />
                        </div>
                        <div className='space-y-1'>
                            <Label>Password</Label>
                            <Input
                                id='password'
                                name='password'
                                type='password'
                                placeholder='Enter your password'
                                required
                                value={formData.password}
                                onChange={handleOnChange}
                            />
                        </div>

                        <Button
                            type='submit'
                            className='w-full'
                            disabled={isLoading}
                        >
                            {isLoading ? "Login in..." : "Login"}
                        </Button>

                        <p className='text-center text-red-500 text-sm font-medium'>
                            Don't have an account ? <Link href={'/auth/register'} className='text-blue-600 hover:underline font-semibold'> Sign Up </Link>
                        </p>
                    </form>

                </div>

            </div>

        </div>
    )
}

export default LoginPage