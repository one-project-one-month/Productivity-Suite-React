  import PomodoroLong from "./PomodoroLong";
  import PomodoroShort from "./PomodoroShort";
  import PomodoroWork from "./PomodoroWork";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


  const Pomodoro = () => {
    return (
      <div className="w-full overflow-x-hidden">
        <Tabs defaultValue="pomodoro" className="w-full my-8">
          <div className="flex justify-center w-full">
            <TabsList className="flex justify-center">
              <TabsTrigger
                value="pomodoro"
                className="text-sm sm:text-md text-gray-600 px-4 sm:px-6 py-3"
              >
                Pomodoro
              </TabsTrigger>
              <TabsTrigger
                value="short"
                className="text-sm sm:text-md text-gray-600 px-4 sm:px-6 py-3"
              >
                Short Break
              </TabsTrigger>
              <TabsTrigger
                value="long"
                className="text-sm sm:text-md text-gray-600 px-4 sm:px-6 py-3"
              >
                Long Break
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="pomodoro"   >
            <PomodoroWork />
          </TabsContent>
          <TabsContent value="short">
            <PomodoroShort />
          </TabsContent>
          <TabsContent value="long">
            <PomodoroLong />
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  export default Pomodoro;
