import type { Meta, StoryObj } from '@storybook/vue3-vite'


import MyButton from './MyButton.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Components/Button',
  component: MyButton,
  render: (args: any) => ({
    components: { MyButton },
    setup() {
      return { args }
    },
    template: '<MyButton v-bind="args">Click me</MyButton>',
  }),
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['giant', 'large', 'medium', 'small', 'tiny'],
      description: 'Taille visuelle du bouton',
      table: {
        type: { summary: "'giant' | 'large' | 'medium' | 'small' | 'tiny'" },
        defaultValue: { summary: 'medium' },
      },
    },

    variant: {
      control: { type: 'radio' },
      options: ['default', 'outline'],
      description: 'Style visuel du bouton',
      table: {
        type: { summary: "'default' | 'outline'" },
        defaultValue: { summary: 'default' },
      },
    },

    disabled: {
      control: { type: 'boolean' },
      description: 'Désactive le bouton',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },

    href: {
      control: { type: 'text' },
      description: 'Transforme le bouton en lien <a>',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: 'undefined' },
      },
    },

    // EVENT
    onClick: {
      action: 'clicked',
      description: 'Événement émis lors du clic',
      table: {
        category: 'Events',
      },
    },
  },
} satisfies Meta<typeof MyButton>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {}

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
}

export const Small: Story = {
  args: {
    size: 'small',
  },
}

export const SmallOutline: Story = {
  args: {
    size: 'small',
    variant: 'outline',
  },
}
