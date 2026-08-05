(() => {
  'use strict';
  const data = window.DEAD_DROP_DATA;
  if (!data?.games) return;

  const buried = data.games
    .flatMap((game) => game.maps || [])
    .find((map) => map.id === 'black-ops-2-buried');
  if (!buried) return;

  const steps = [
    ...(buried.mainQuests || []).flatMap((quest) => quest.steps || []),
    ...(buried.requiredGuides || []).flatMap((guide) => guide.steps || []),
    ...(buried.optionalSideQuests || []).flatMap((guide) => guide.steps || [])
  ];

  for (const step of steps) {
    step.images = (step.images || []).filter((image) => !/bur1\.png|pigpen\s*\/\s*tic-tac-toe cipher key/i.test(`${image.src || ''} ${image.title || ''}`));
  }
})();