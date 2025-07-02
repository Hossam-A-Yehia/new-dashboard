import CustomImage from "@/components/atoms/Image/CustomImage";

const NoData = ({width = 200,height = 500}:{width?:number, height?:number}) => {
  return (
    <div
      className="flex flex-col items-center justify-center p-4 w-full"
      data-testid="no-data-container"
    >
      <CustomImage src="/empty-state.png" width={width} height={height} alt={"EmptyState"} className="mb-4" />
      <h2 className="text-2xl text-gray-700 font-bold mb-2 text-center">
        No Data Available
      </h2>
      <p className="text-gray-500 mb-6 text-center">
        Oops! It looks like there's no data to display at the moment. Please
        check back later or try refreshing the page.
      </p>
    </div>
  );
};

export default NoData;
