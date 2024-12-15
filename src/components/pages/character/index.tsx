import { useGetListCharacter } from "@/hook/useGetListCharacter";
import { ICharacter } from "@/interfaces/character";
import { CharactorTemplate } from "@/components/templates/character";
import { useCallback, useEffect, useState } from "react";

export const CharactorPage = () => {
  const [ListCharacter, setListCharacter] = useState<ICharacter[]>([]);
  const { data: resListCharacter } = useGetListCharacter();

  useEffect(() => {
    if (resListCharacter) {
      setListCharacter(resListCharacter);
    }
  }, [resListCharacter]);
  const handleSetState = useCallback((data: any) => {
    setListCharacter(data);
  }, []);
  return (
    <div>
      <CharactorTemplate dataSource={ListCharacter} setState={handleSetState} />
    </div>
  );
};
