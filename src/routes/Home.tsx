import { Heading } from '../common/components';

export const Home = () => {
  return (
    <div className="flex-1 flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center h-full">
        <Heading tag="h1">Mason's Demos</Heading>
        <p>Choose an item from the site header</p>
      </div>
    </div>
  );
};
