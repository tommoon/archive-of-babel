import React, { useState } from 'react';
import { Container } from './components/Container';
import { useResetPosition } from '@/hooks/useResetPosition';
import { BuyMeACoffee } from './components/BuyMeACoffee';

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const [error, setError] = useState('')
  useResetPosition()

  function onSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    e.stopPropagation();

    fetch("https://formcarry.com/s/hYRObWGvgkB", {
      method: 'POST',
      headers: { 
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, message })
    })
    .then(response => response.json())
    .then(response => {
      if (response.code === 200) {
        alert("We received your submission, thank you!");
      }
      else if(response.code === 422){
        // Field validation failed
        setError(response.message)
      }
      else {
        // other error from formcarry
        setError(response.message)
      }
    })
    .catch(error => {
      // request related error.
      setError(error.message ? error.message : error);
    });
  }


    return <div className=" m-auto max-w-prose text-base h-screen flex flex-col gap-y-8 justify-center"
    style={{
    fontSize:'unset'
    }}>
      <Container>
    <form className='flex flex-col gap-y-4' onSubmit={(e) => onSubmit(e)}>

<label className="input input-bordered flex items-center gap-2">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="h-4 w-4 opacity-70">
    <path
      d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
  </svg>
  <input required type="text" value={name} onChange={(e) => setName(e.target.value)} id="name" className="grow input-lg" placeholder="Full Name" />
                </label>
                <label className="input input-bordered flex items-center gap-2">

  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="h-4 w-4 opacity-70">
    <path
      d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
    <path
      d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                    </svg>
                    
  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} id="email"  className="grow input-lg" placeholder="Email" />
                </label>
                <textarea required value={message} onChange={(e) => setMessage(e.target.value)} id="message" className="textarea textarea-bordered w-full textarea-lg" placeholder="Your Message Here"></textarea>
                {error && <p>{error}</p>}
                <button className="btn btn-accent text-xl" type='submit'>send</button>
            </form>
        </Container>
        
        <Container>
            <div className='flex gap-x-2'>
            <p className='text-xl'>Please consider supporting server costs by buying me a coffee!</p>
            <BuyMeACoffee/>
            </div>
        </Container>
  </div>
}