"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

interface Props {
  className?: string;
}

type FormValues = {
  subscription_email: string;
};

const defaultValues = {
  subscription_email: "",
};

const Subscription: React.FC<Props> = ({
  className = "px-5 sm:px-8 md:px-16 2xl:px-24 mt-10",
}) => {
  const {
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });
  async function onSubmit(input: FormValues) {
  }
  return (
    <div
      className={`${className} relative w-full text-center flex  flex-col justify-center xl:justify-between items-center  bg-green-950 py-10 md:py-14  lg:py-16`}

      style={{
        backgroundImage: `url('/assets/images/category/pattern.png')`,
        backgroundSize: 'cover',
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}

    >


      <div className="-mt-1.5 lg:-mt-2 text-balance xl:-mt-0.5 flex flex-col  xl:text-center mb-7 md:mb-8 lg:mb-9 w-full xl:mb-0">
        <label
          //   variant="mediumHeading"
          className="mb-10 w-full sm:flex-col text-center text-white md:mb-2.5 lg:mb-3 xl:mb-3.5 uppercase text-sm sm:text-2xl"
        >
          Join the IVÓ mailing list
        </label>
        <p className="text-white text-center text-xl mt-6 sm:mt-12 md:text-3xl leading-6 md:leading-7">
          JOIN OUR EXCLUSIVE NEWSLETTER COMMUNITY AND RECEIVE OUR LATEST UPDATES, NEWS AND EXCLUSIVE OFFERS!
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-shrink-0 w-full sm:w-96 md:w-[545px]"
        noValidate>
        <div className="bg-white gap-2 sm:mt-12 flex items-center sm:w-[500px] border p-2 border-gray-300 rounded-md overflow-hidden shadow-sm">
          <Input
            type="email"
            // value={inputValue} // Bind state to input
            // onChange={handleInputChange} // Handle input change
            placeholder="Email Address"
            className="flex-1 sm:w-full p-2 border-xl focus:ring-0"
          >

          </Input>

          <Button
            type="button"
            className="rounded-md sm:w-[150px] bg-green-950 hover:bg-green-400 focus:ring-green-500"
          >
            SUBSCRIBE
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Subscription;
