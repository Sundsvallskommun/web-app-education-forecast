import { shallow } from 'zustand/shallow';
import { useUserStore } from '@services/user-service/user-service';
import { HeadingMenu } from '@components/heading-menu/heading-menu.component';
import { Spinner } from '@sk-web-gui/react';
import { hasRolePermission } from '@utils/has-role-permission';
import Loader from '@components/loader/loader';
import { useState } from 'react';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { SinglePupilTable } from './components/single-pupil-table.component';

export const Pupil: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const user = useUserStore((s) => s.user, shallow);
  const singlePupilIsLoading = usePupilForecastStore((s) => s.singlePupilIsLoading);
  const mentorClassIsLoading = usePupilForecastStore((s) => s.mentorClassIsLoading);
  const pupilsIsLoading = usePupilForecastStore((s) => s.pupilsIsLoading);
  const pupil = usePupilForecastStore((s) => s.pupil);
  const { headmaster } = hasRolePermission(user);

  const pageTitle = pupil.length !== 0 ? `${pupil[0].givenname} ${pupil[0].lastname}` : 'Elev';

  let presenceSum = 0;

  pupil.forEach((p) => {
    p.presence ? (presenceSum += p.presence) : 0;
  });

  const generalInformation = (
    <div className="flex gap-14">
      <span className="flex gap-4 items-center">
        <strong>{pupil.length !== 0 ? pupil.length : <Spinner size={2} />}</strong> ämnen
      </span>
    </div>
  );

  const imageWithText = {
    initials: `${pupil[0]?.className?.slice(0, 2)}`,
    imageText: `${pupil[0]?.className}`,
    textLink: headmaster ? `/klasser/klass/${pupil[0]?.classGroupId}` : `/min-mentorsklass/${pupil[0]?.classGroupId}`,
    color: 'vattjom' as 'vattjom' | 'juniskar' | 'bjornstigen' | 'gronsta',
  };

  return (
    <div>
      <HeadingMenu
        pageTitle={pageTitle}
        imageWithTextProperties={imageWithText}
        GeneralInformation={generalInformation}
        callback="pupil"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Sök på ämne eller lärare..."
      />
      {(!headmaster && !mentorClassIsLoading && !singlePupilIsLoading && pupil.length !== 0) ||
      (headmaster && !pupilsIsLoading && !singlePupilIsLoading && pupil.length !== 0) ? (
        <>
          {' '}
          {pupil.length !== 0 ? (
            <SinglePupilTable user={user} searchQuery={searchQuery} />
          ) : (
            <p>Inga sökresultat att visa</p>
          )}
        </>
      ) : (
        <div className="h-[500px] flex justify-center items-center">
          <Loader />
        </div>
      )}
    </div>
  );
};
