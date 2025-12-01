import type { Meta, StoryObj } from '@storybook/vue3-vite'

import MyInput from './MyInput.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Components/Input',
  component: MyInput,
  render: (args) => ({
    components: { MyInput },
    setup() {
      return { args }
    },
    template: '<MyInput v-bind="args"/>',
  }),
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'password', 'email'],
      description: 'Type of the input',
      table: {
        type: { summary: "'text' | 'password' | 'email'" },
        defaultValue: { summary: 'text' },
      },
    },

    label: {
      control: { type: 'text' },
      description: 'Label for the input',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
} satisfies Meta<typeof MyInput>

export default meta
type Story = StoryObj<typeof meta>

export const PasswordInput: Story = {
  args: {
    type: 'password',
    label: 'Mon label',
  },
}

export const InputTextWithLabel: Story = {
  args: {
    type: 'text',
    label: 'Mon label',
  },
}