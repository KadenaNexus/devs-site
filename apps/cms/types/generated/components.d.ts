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

export interface SolveItemSolveItem extends Struct.ComponentSchema {
  collectionName: 'components_solve_item_solve_items';
  info: {
    displayName: 'solve_item';
  };
  attributes: {
    description: Schema.Attribute.String;
    iconKey: Schema.Attribute.String;
    title: Schema.Attribute.String;
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
      'solve-item.solve-item': SolveItemSolveItem;
      'solve-section.solve-section': SolveSectionSolveSection;
      'stat-item.stat-item': StatItemStatItem;
      'why-item.why-item': WhyItemWhyItem;
    }
  }
}
