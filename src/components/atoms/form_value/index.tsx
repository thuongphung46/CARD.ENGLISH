import { FC, useCallback, useMemo } from "react";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { IFormState } from "@/interfaces/action";
import { t } from "i18next";
import Box from "@mui/material/Box";

export interface IFormField {
  id: string;
  label: string;
  type: "text" | "number" | "select" | "decimal" | "selectMutiple";
  isRequire?: boolean;
  readonly?: boolean;
  ref?: any;
  options?: {
    value?: any;
    label?: string;
  }[];
  defaultValue?: {
    value?: any;
    label?: string;
  }[];
}
interface Props extends IFormState {
  fields: IFormField[];
  handleOnChangeField: (data: any) => void;
  formData: any;
}

const FormField: FC<Props> = ({
  fields,
  handleOnChangeField,
  formData,
  action,
}) => {
  const renderField = useCallback(
    (field: IFormField) => {

      switch (field.type) {
        case "selectMutiple":
          return (
            <>
              {field.options &&
                field.options.length > 0 ?
                field.defaultValue && (
                  <Autocomplete
                    readOnly={field.readonly}
                    size="small"
                    ref={field.ref}
                    id={field.id}
                    multiple
                    sx={{ width: "100%" }}
                    filterSelectedOptions
                    defaultValue={field.defaultValue}
                    onChange={(e, newValue: any) => {
                      handleOnChangeField({
                        target: {
                          name: field.id,
                          value: newValue,
                        },
                      });
                    }}
                    options={field.options}
                    getOptionKey={(option) => option?.value}
                    getOptionLabel={(option) => option?.label}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder={t(field.label)}
                        variant="outlined"
                      />
                    )}
                  />
                ) : <>không có dữ liệu</>}
            </>
          );
        default:
          return <>error</>;
      }
    },
    [handleOnChangeField]
  );

  const renderFields = useMemo(() => {
    return fields.map((field) => (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          padding: "8px",
        }}
        key={field.id}
      >
        {renderField(field)}
      </Box>
    ));
  }, [fields, renderField]);

  return <>{renderFields}</>;
};

export default FormField;
