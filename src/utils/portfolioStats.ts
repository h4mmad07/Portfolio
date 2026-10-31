import { PortfolioSchema, StatItem } from '../types/portfolio';

export const getPortfolioStats = (data: PortfolioSchema): StatItem[] => {
  const completedProjects = data.projects.filter(
    (project) =>
      project.isPublished !== false &&
      (project.status === 'Completed' || project.status === 'Production')
  ).length;
  const languageCategory = data.skillCategories.find((category) =>
    category.title.toLowerCase().includes('language')
  );
  const education = data.education.find((item) => item.isVisible !== false);
  const visibleExperience = data.experience.filter((item) => item.isVisible !== false);
  const experience = visibleExperience.find((item) => item.currentlyWorking) || visibleExperience[0];
  const languageCount = new Set(
    (languageCategory?.skills || [])
      .map((skill) => skill.name.trim().toLowerCase())
      .filter(Boolean)
  ).size;

  const stats: StatItem[] = [
    {
      label: 'Completed Projects',
      value: String(completedProjects),
      suffix: 'Built'
    },
    {
      label: 'Core Languages',
      value: String(languageCount),
      suffix: 'Languages'
    }
  ];

  if (education) {
    const degreeAbbreviation = education.degree.match(/\(([^)]+)\)/)?.[1];
    stats.push({
      label: 'Education',
      value: degreeAbbreviation || education.degree,
      suffix: education.period
    });
  }

  if (experience) {
    const [start, end] = experience.period.split(/\s+[–—-]\s+/).map((part) => part.trim());
    const formatDate = (date: string) => {
      const parsed = new Date(`${date.slice(0, 10)}T00:00:00`);
      return Number.isNaN(parsed.getTime())
        ? date
        : new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(parsed);
    };
    const startDate = experience.startDate ? formatDate(experience.startDate) : start;
    const endDate = experience.endDate ? formatDate(experience.endDate) : end;
    const isCurrent = experience.currentlyWorking === true || /present/i.test(experience.period);

    stats.push({
      label: experience.role,
      value: startDate || experience.period,
      suffix: isCurrent ? 'Present' : endDate || ''
    });
  }

  return stats;
};
