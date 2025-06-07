import type { Schema, Struct } from '@strapi/strapi';

export interface OrderOrderItem extends Struct.ComponentSchema {
  collectionName: 'components_order_items';
  info: {
    description: 'Individual item in an order';
    displayName: 'Order Item';
    icon: 'shopping-cart';
  };
  attributes: {
    priceAtTime: Schema.Attribute.Decimal & Schema.Attribute.Required;
    product: Schema.Attribute.Relation<'oneToOne', 'api::product.product'>;
    quantity: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
  };
}

export interface OrderShippingAddress extends Struct.ComponentSchema {
  collectionName: 'components_order_shipping_addresses';
  info: {
    description: 'Delivery address for an order';
    displayName: 'Shipping Address';
    icon: 'map-marker-alt';
  };
  attributes: {
    city: Schema.Attribute.String & Schema.Attribute.Required;
    streetAddress: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface RecipeIngredient extends Struct.ComponentSchema {
  collectionName: 'components_recipe_ingredients';
  info: {
    description: 'Recipe ingredient with quantity and unit';
    displayName: 'Ingredient';
    icon: 'carrot';
  };
  attributes: {
    isOptional: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    product: Schema.Attribute.Relation<'oneToOne', 'api::product.product'>;
    quantity: Schema.Attribute.String & Schema.Attribute.Required;
    unit: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface RecipeStep extends Struct.ComponentSchema {
  collectionName: 'components_recipe_steps';
  info: {
    description: 'Recipe preparation step';
    displayName: 'Step';
    icon: 'list-ol';
  };
  attributes: {
    duration: Schema.Attribute.String;
    instruction: Schema.Attribute.Text & Schema.Attribute.Required;
    stepNumber: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    temperature: Schema.Attribute.String;
  };
}

export interface RecipeTag extends Struct.ComponentSchema {
  collectionName: 'components_recipe_tags';
  info: {
    description: 'Recipe tag';
    displayName: 'Tag';
    icon: 'tag';
  };
  attributes: {
    name: Schema.Attribute.Enumeration<
      [
        '\u0441\u0430\u043B\u0430\u0442\u0438',
        '\u0432\u0435\u0433\u0435\u0442\u0430\u0440\u0438\u0430\u043D\u0441\u043A\u043E',
        '\u043B\u0435\u0441\u043D\u043E',
        '\u0441\u0443\u043F\u0438',
        '\u043F\u0438\u043B\u0435\u0448\u043A\u043E',
        '\u0434\u0435\u0441\u0435\u0440\u0442\u0438',
        '\u0437\u0430\u043A\u0443\u0441\u043A\u0438',
        '\u043E\u0441\u043D\u043E\u0432\u043D\u043E',
        '\u0431\u044A\u0440\u0437\u043E',
        '\u0437\u0434\u0440\u0430\u0432\u043E\u0441\u043B\u043E\u0432\u043D\u043E',
      ]
    > &
      Schema.Attribute.Required;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedNutritionFact extends Struct.ComponentSchema {
  collectionName: 'components_shared_nutrition_facts';
  info: {
    displayName: 'Nutrition Fact';
    icon: 'apple-alt';
  };
  attributes: {
    calories: Schema.Attribute.Decimal;
    carbs: Schema.Attribute.Decimal;
    fat: Schema.Attribute.Decimal;
    fiber: Schema.Attribute.Decimal;
    protein: Schema.Attribute.Decimal;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'order.order-item': OrderOrderItem;
      'order.shipping-address': OrderShippingAddress;
      'recipe.ingredient': RecipeIngredient;
      'recipe.step': RecipeStep;
      'recipe.tag': RecipeTag;
      'shared.media': SharedMedia;
      'shared.nutrition-fact': SharedNutritionFact;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
    }
  }
}
