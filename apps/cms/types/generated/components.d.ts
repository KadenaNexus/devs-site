import type { Schema, Struct } from '@strapi/strapi';

export interface HeroSectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_hero_sections_heroes';
  info: {
    displayName: 'Hero';
    icon: 'house';
  };
  attributes: {
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    primaryCtaLink: Schema.Attribute.String;
    primaryCtaText: Schema.Attribute.String;
    secondaryCtaLink: Schema.Attribute.String;
    secondaryCtaText: Schema.Attribute.String;
    subheading: Schema.Attribute.String;
  };
}

export interface SocialLinkSharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_social_link_shared_social_links';
  info: {
    displayName: 'shared.social_link';
    icon: 'link';
  };
  attributes: {
    icon: Schema.Attribute.String;
    label: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface SocialMediaSocialMedia extends Struct.ComponentSchema {
  collectionName: 'components_social_media_social_medias';
  info: {
    displayName: 'social_media';
    icon: 'link';
  };
  attributes: {
    link: Schema.Attribute.Text;
  };
}

export interface SolveItemSolveItem extends Struct.ComponentSchema {
  collectionName: 'components_solve_item_solve_items';
  info: {
    displayName: 'solve_item';
  };
  attributes: {
    description: Schema.Attribute.Text;
    iconKey: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SolveProgressSolveProgress extends Struct.ComponentSchema {
  collectionName: 'components_solve_progress_solve_progresses';
  info: {
    displayName: 'solve_progress';
  };
  attributes: {
    heading: Schema.Attribute.String;
    solve_sub_steps: Schema.Attribute.Component<
      'solve-sub-steps.solve-sub-steps',
      true
    >;
    subheading: Schema.Attribute.Text;
  };
}

export interface SolveSectionSolveSection extends Struct.ComponentSchema {
  collectionName: 'components_solve_section_solve_sections';
  info: {
    displayName: 'solve_section';
  };
  attributes: {
    items: Schema.Attribute.Component<'solve-item.solve-item', true>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SolveSubProgressListSolveSubProgressList
  extends Struct.ComponentSchema {
  collectionName: 'components_solve_sub_progress_list_solve_sub_progress_lists';
  info: {
    displayName: 'solve_sub_progress_list';
  };
  attributes: {
    solve_sub_progress_list: Schema.Attribute.Text;
  };
}

export interface SolveSubStepsSolveSubSteps extends Struct.ComponentSchema {
  collectionName: 'components_solve_sub_steps_solve_sub_steps';
  info: {
    displayName: 'solve_sub_steps';
  };
  attributes: {
    label: Schema.Attribute.Text;
    solve_sub_progress_list: Schema.Attribute.Component<
      'solve-sub-progress-list.solve-sub-progress-list',
      true
    >;
    sublabel: Schema.Attribute.Text;
  };
}

export interface StatItemStatItem extends Struct.ComponentSchema {
  collectionName: 'components_stat_item_stat_items';
  info: {
    displayName: 'stat_item';
  };
  attributes: {
    label: Schema.Attribute.String;
    sublabel: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface TeamTeam extends Struct.ComponentSchema {
  collectionName: 'components_team_teams';
  info: {
    displayName: 'team';
    icon: 'user';
  };
  attributes: {
    bio: Schema.Attribute.Text;
    designation: Schema.Attribute.String;
    name: Schema.Attribute.String;
    social_media: Schema.Attribute.Component<'social-media.social-media', true>;
  };
}

export interface WhyItemWhyItem extends Struct.ComponentSchema {
  collectionName: 'components_why_item_why_items';
  info: {
    displayName: 'why_item';
  };
  attributes: {
    iconKey: Schema.Attribute.String;
    text: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'hero.sections-hero': HeroSectionsHero;
      'social-link.shared-social-link': SocialLinkSharedSocialLink;
      'social-media.social-media': SocialMediaSocialMedia;
      'solve-item.solve-item': SolveItemSolveItem;
      'solve-progress.solve-progress': SolveProgressSolveProgress;
      'solve-section.solve-section': SolveSectionSolveSection;
      'solve-sub-progress-list.solve-sub-progress-list': SolveSubProgressListSolveSubProgressList;
      'solve-sub-steps.solve-sub-steps': SolveSubStepsSolveSubSteps;
      'stat-item.stat-item': StatItemStatItem;
      'team.team': TeamTeam;
      'why-item.why-item': WhyItemWhyItem;
    }
  }
}
