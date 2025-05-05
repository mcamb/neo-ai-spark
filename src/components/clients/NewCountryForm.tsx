
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface NewCountryFormProps {
  onSubmit: (countryName: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const NewCountryForm: React.FC<NewCountryFormProps> = ({ onSubmit, onCancel, isSubmitting }) => {
  const form = useForm({
    defaultValues: {
      countryName: '',
    }
  });

  const handleSubmit = async (values: { countryName: string }) => {
    await onSubmit(values.countryName);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="countryName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country Name</FormLabel>
              <FormControl>
                <Input placeholder="United States" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Country"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewCountryForm;
