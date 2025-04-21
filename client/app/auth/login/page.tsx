import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-dropdown-menu'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const page = () => {
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

                <form className='space-y-4'>
                    <div className='space-y-1'>
                        <Label>Email</Label>
                        <Input
                            id='email'
                            name='email'
                            type='text'
                            placeholder='Enter your email'
                            required
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
                        />
                    </div>

                    <Button 
                    type='submit'
                    className='w-full'>
                        Login
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

export default page