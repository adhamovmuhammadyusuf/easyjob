"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "John Doe",
    role: "Software Engineer",
    company: "Tech Corp",
    image: "/placeholder-user.jpg",
    text: "Found my dream job through this platform. The process was smooth and efficient.",
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "UI/UX Designer",
    company: "Design Studio",
    image: "/placeholder-user.jpg",
    text: "Great platform for finding design opportunities. Very user-friendly!",
  },
  {
    id: 3,
    name: "Mike Johnson",
    role: "Product Manager",
    company: "Innovation Labs",
    image: "/placeholder-user.jpg",
    text: "The quality of job listings is excellent. Highly recommend!",
  },
];

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const current = testimonials[currentIndex];

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 relative">
          <Image
            src={current.image}
            alt={current.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <p className="text-gray-600 text-lg mb-6">"{current.text}"</p>
        <h3 className="font-semibold text-lg">{current.name}</h3>
        <p className="text-gray-500">
          {current.role} at {current.company}
        </p>
      </div>

      <button
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="flex justify-center mt-6 gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

