import Image from "next/image";
import Link from "next/link";

const testimonials = [
  
  
  [
    {
      content:
        "Hey its me! Wow I look sharp",
      link: "https://twitter.com/",
      author: {
        name: "Rafael S.",
        role: "Software Engineer",
        image: "/rafa.jpg",
      },
    },
  ],
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-label="What our customers are saying"
      className="py-10"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto md:text-center">
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal text-black-800 sm:text-6xl">
            Loved by many worldwide
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-gray-700 leading-7">
            See what our users are saying about{" "}
            <Link target="_blank" href="https://twitter.com/search?q=%23proheadshot">
              <span className="text-blue-600">#proheadshot</span>
            </Link>
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-16 lg:max-w-none lg:grid-cols-3"
        >
          {testimonials.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-6 sm:gap-y-8">
                {column.map((testimonial, testimonialIndex) => (
                  <li
                    key={testimonialIndex}
                    className="hover:scale-105 transition duration-300 ease-in-out"
                  >
                    <a href={testimonial.link} target="_blank" rel="noreferrer">
                      <figure className="relative rounded-2xl bg-gray-700 p-6 shadow-xl shadow-slate-900/10">
                        <blockquote className="relative">
                          <p className="text-lg tracking-tight text-slate-100">
                            "{testimonial.content}"
                          </p>
                        </blockquote>
                        <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                          <div>
                            <div className="font-display text-base text-slate-100">
                              {testimonial.author.name}
                            </div>
                            <div className="mt-1 text-sm text-slate-200">
                              {testimonial.author.role}
                            </div>
                          </div>
                          <div className="overflow-hidden rounded-full bg-slate-50">
                            <Image
                              className="h-14 w-14 object-cover"
                              src={testimonial.author.image}
                              alt="picture of the testimonial author"
                              width={56}
                              height={56}
                            />
                          </div>
                        </figcaption>
                      </figure>
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}