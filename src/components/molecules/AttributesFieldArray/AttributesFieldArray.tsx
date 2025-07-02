import { useEffect } from "react";
import { Field, FieldArray, useFormikContext } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";

const InputFile = ({
  name,
  fileID,
  fileTitle,
  acceptedFiles,
  handleFileUpload,
  isInvalid,
  errors,
  value,
  onBlur,
}: {
  name: string;
  fileID: string;
  fileTitle: string;
  acceptedFiles: string;
  handleFileUpload: (value: File | null) => void;
  isInvalid: boolean;
  errors?: string;
  value?: File;
  onBlur: (e: React.FocusEvent) => void;
}) => {
  return (
    <Box>
      <input
        id={fileID}
        name={name}
        type="file"
        accept={acceptedFiles}
        onChange={(event) => {
          const file = event.target.files?.[0] || null;
          handleFileUpload(file);
        }}
        onBlur={onBlur}
        style={{ display: "none" }}
      />
      <label htmlFor={fileID}>
        <Box
          sx={{
            border: "1px solid",
            borderColor: isInvalid ? "error.main" : "grey.500",
            borderRadius: 1,
            p: 1,
            cursor: "pointer",
            bgcolor: "background.paper",
          }}
        >
          <Typography>
            {value ? value.name : `Upload ${fileTitle}`}
          </Typography>
        </Box>
      </label>
      {isInvalid && errors && (
        <FormHelperText error>{errors}</FormHelperText>
      )}
    </Box>
  );
};

// Hidden Field Component
const HiddenField = ({ name, value }: { name: string; value: any }) => {
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    setFieldValue(name, value);
  }, [name, value, setFieldValue]);

  return null;
};

// Styled Components
const FormField = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: "100%",
  [theme.breakpoints.up("lg")]: {
    width: "100%",
    paddingRight: theme.spacing(0),
  },
}));

// Interfaces
interface Attribute {
  id: string;
  value: string;
  type: string;
  name_en: string;
  name_ar: string;
  values?: string | { en: string; ar: string }[];
}

interface AttributesFieldArrayProps {
  form: any;
  isMutatePutLoading: boolean;
  attributes: Attribute[];
  isOptional?: boolean;
}

// Main Component
const AttributesFieldArray: React.FC<AttributesFieldArrayProps> = ({
  form,
  isMutatePutLoading,
  attributes,
  isOptional = false,
}) => {
  const { i18n: { language } } = useTranslation();

  const isString = (attributeValues: any): attributeValues is string =>
    typeof attributeValues === "string";

  let valueValidationSchema = Yup.string();
  if (!isOptional) {
    valueValidationSchema = Yup.string().required(
      "Attribute value is required"
    );
  }

  return (
    <FieldArray name="attributes">
      {() =>
        attributes?.map((attribute, index) => (
          <Box key={index} sx={{ display: "flex", flexWrap: "wrap" }}>
            {/* TEXT and TEXT_AREA */}
            {(attribute.value === "TEXT" || attribute.value === "TEXT_AREA") && (
              <Box sx={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
                <FormField>
                  <Field
                    name={`attributes[${index}].en`}
                    validate={(value: string) => {
                      try {
                        valueValidationSchema.validateSync(value);
                      } catch (error: any) {
                        return error.message;
                      }
                    }}
                  >
                    {({ field, form: fieldForm }: any) => (
                      <FormControl fullWidth error={!!fieldForm.errors.attributes?.[index]?.en}>
                        <InputLabel shrink>
                          {language === "en" ? attribute.name_en : attribute.name_ar} - EN
                          <Typography component="span" color="error" sx={{ ml: 0.5 }}>*</Typography>
                        </InputLabel>
                        <TextField
                          {...field}
                          fullWidth
                          label={`${language === "en" ? attribute.name_en : attribute.name_ar} - EN`}
                          placeholder={`Enter ${attribute.name_en} value`}
                          multiline={attribute.value === "TEXT_AREA"}
                          rows={attribute.value === "TEXT_AREA" ? 4 : 1}
                          disabled={isMutatePutLoading}
                          error={
                            (fieldForm.touched.attributes?.[index]?.attribute_id ||
                              fieldForm.touched.attributes?.[index]?.en) &&
                            !!fieldForm.errors.attributes?.[index]?.en
                          }
                        />
                        {(fieldForm.touched.attributes?.[index]?.attribute_id ||
                          fieldForm.touched.attributes?.[index]?.en) &&
                          fieldForm.errors.attributes?.[index]?.en && (
                            <FormHelperText>
                              {fieldForm.errors.attributes?.[index]?.en}
                            </FormHelperText>
                          )}
                      </FormControl>
                    )}
                  </Field>
                </FormField>
                <FormField>
                  <Field
                    name={`attributes[${index}].ar`}
                    validate={(value: string) => {
                      try {
                        valueValidationSchema.validateSync(value);
                      } catch (error: any) {
                        return error.message;
                      }
                    }}
                  >
                    {({ field, form: fieldForm }: any) => (
                      <FormControl fullWidth error={!!fieldForm.errors.attributes?.[index]?.ar}>
                        <InputLabel shrink>
                          {language === "en" ? attribute.name_en : attribute.name_ar} - AR
                          <Typography component="span" color="error" sx={{ ml: 0.5 }}>*</Typography>
                        </InputLabel>
                        <TextField
                          {...field}
                          fullWidth
                          label={`${language === "en" ? attribute.name_en : attribute.name_ar} - AR`}
                          placeholder={`Enter ${attribute.name_ar} value`}
                          multiline={attribute.value === "TEXT_AREA"}
                          rows={attribute.value === "TEXT_AREA" ? 4 : 1}
                          disabled={isMutatePutLoading}
                          error={
                            (fieldForm.touched.attributes?.[index]?.attribute_id ||
                              fieldForm.touched.attributes?.[index]?.ar) &&
                            !!fieldForm.errors.attributes?.[index]?.ar
                          }
                        />
                        {(fieldForm.touched.attributes?.[index]?.attribute_id ||
                          fieldForm.touched.attributes?.[index]?.ar) &&
                          fieldForm.errors.attributes?.[index]?.ar && (
                            <FormHelperText>
                              {fieldForm.errors.attributes?.[index]?.ar}
                            </FormHelperText>
                          )}
                      </FormControl>
                    )}
                  </Field>
                </FormField>
                <Field name={`attributes[${index}].isMulti`}>
                  {() => (
                    <HiddenField
                      name={`attributes[${index}].isMulti`}
                      value={true}
                    />
                  )}
                </Field>
              </Box>
            )}

            {/* NUMBER, DATE, and URL */}
            {(attribute.value === "NUMBER" ||
              attribute.value === "DATE" ||
              attribute.value === "URL") && (
              <FormField>
                <Field
                  name={`attributes[${index}].value`}
                  validate={(value: string) => {
                    try {
                      valueValidationSchema.validateSync(value);
                    } catch (error: any) {
                      return error.message;
                    }
                    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
                    if (attribute.value === "URL" && !urlRegex.test(value)) {
                      return "Please enter a valid URL!";
                    }
                  }}
                >
                  {({ field, form: fieldForm }: any) => (
                    <FormControl fullWidth error={!!fieldForm.errors.attributes?.[index]?.value}>
                      <InputLabel shrink>
                        {language === "en" ? attribute.name_en : attribute.name_ar}
                        <Typography component="span" color="error" sx={{ ml: 0.5 }}>*</Typography>
                      </InputLabel>
                      <TextField
                        {...field}
                        fullWidth
                        label={language === "en" ? attribute.name_en : attribute.name_ar}
                        placeholder={`Enter ${attribute.name_en} value`}
                        type={attribute.type.toLowerCase()}
                        disabled={isMutatePutLoading}
                        error={
                          (fieldForm.touched.attributes?.[index]?.attribute_id ||
                            fieldForm.touched.attributes?.[index]?.value) &&
                          !!fieldForm.errors.attributes?.[index]?.value
                        }
                      />
                      {(fieldForm.touched.attributes?.[index]?.attribute_id ||
                        fieldForm.touched.attributes?.[index]?.value) &&
                        fieldForm.errors.attributes?.[index]?.value && (
                          <FormHelperText>
                            {fieldForm.errors.attributes?.[index]?.value}
                          </FormHelperText>
                        )}
                    </FormControl>
                  )}
                </Field>
              </FormField>
            )}

            {/* SELECT_BOX */}
            {attribute.value === "SELECT_BOX" && (
              <FormField>
                <Field
                
                  name={`attributes[${index}].value`}
                  validate={(value: string) => {
                    try {
                      valueValidationSchema.validateSync(value);
                    } catch (error: any) {
                      return error.message;
                    }
                  }}
                >
                  {({ field, form: fieldForm }: any) => {
                    const options = (isString(attribute?.values)
                      ? JSON.parse(attribute.values)
                      : attribute?.values
                    )?.map((el: { en: string; ar: string }) => ({
                      label: el.en,
                      value: JSON.stringify(el),
                    }));
                    return (
                      <FormControl fullWidth error={!!fieldForm.errors.attributes?.[index]?.value}>
                        <InputLabel  >
                          {language === "en" ? attribute.name_en : attribute.name_ar}
                          <Typography component="span" color="error" sx={{ ml: 0.5 }}>*</Typography>
                        </InputLabel>
                        <Select
                          {...field}
                          label={`${language === "en" ? attribute.name_en : attribute.name_ar} *`}
                          value={fieldForm.values.attributes?.[index]?.value || ""}
                          onChange={(event) => {
                            fieldForm.setFieldValue(`attributes[${index}].value`, event.target.value);
                          }}
                          onBlur={fieldForm.handleBlur}
                          disabled={isMutatePutLoading}
                        >
                          {options.map((option: { label: string; value: string }) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {(fieldForm.touched.attributes?.[index]?.attribute_id ||
                          fieldForm.touched.attributes?.[index]?.value) &&
                          fieldForm.errors.attributes?.[index]?.value && (
                            <FormHelperText>
                              {fieldForm.errors.attributes?.[index]?.value}
                            </FormHelperText>
                          )}
                      </FormControl>
                    );
                  }}
                </Field>
              </FormField>
            )}

            {/* RADIO */}
            {attribute.value === "RADIO" && (
              <FormField>
                <FormControl
                  component="fieldset"
                  error={!!form.errors.attributes?.[index]?.value}
                >
                  <Typography component="legend">
                    {language === "en" ? attribute.name_en : attribute.name_ar}
                    <Typography component="span" color="error" sx={{ ml: 0.5 }}>*</Typography>
                  </Typography>
                  <Field
                    name={`attributes[${index}].value`}
                    validate={(value: string) => {
                      try {
                        valueValidationSchema.validateSync(value);
                      } catch (error: any) {
                        return error.message;
                      }
                    }}
                  >
                    {({ field, form: fieldForm }: any) => (
                      <RadioGroup
                        {...field}
                        onChange={(event) => {
                          fieldForm.setFieldValue(`attributes[${index}].value`, event.target.value);
                        }}
                      >
                        {(isString(attribute?.values)
                          ? JSON.parse(attribute.values)
                          : attribute?.values
                        )?.map((el: { en: string; ar: string }, idx: number) => (
                          <FormControlLabel
                            key={`${el.ar}-${idx}`}
                            value={el.ar}
                            control={<Radio disabled={isMutatePutLoading} />}
                            label={language === "en" ? el.en : el.ar}
                          />
                        ))}
                      </RadioGroup>
                    )}
                  </Field>
                  {form.touched.attributes?.[index]?.attribute_id &&
                    form.errors.attributes?.[index]?.value && (
                      <FormHelperText>
                        {form.errors.attributes?.[index]?.value}
                      </FormHelperText>
                    )}
                </FormControl>
              </FormField>
            )}

            {/* IMAGE */}
            {attribute.value === "IMAGE" && (
              <FormField>
                <Field
                  name={`attributes[${index}].value`}
                  validate={(value: File | undefined) => {
                    if (value && value.size > 2000 * 1024) {
                      return "File size is too large ( max 2000KB )";
                    }
                    try {
                      valueValidationSchema.validateSync(value);
                    } catch (error: any) {
                      return error.message;
                    }
                  }}
                >
                  {({ field, form: fieldForm }: any) => (
                    <Box>
                      <Typography>
                        {language === "en" ? attribute.name_en : attribute.name_ar}
                        <Typography component="span" color="error" sx={{ ml: 0.5 }}>*</Typography>
                      </Typography>
                      <InputFile
                        onBlur={fieldForm.handleBlur}
                        name={field.name}
                        fileID={field.name}
                        fileTitle="Image"
                        acceptedFiles="image/png,image/gif,image/jpeg"
                        handleFileUpload={(value) => {
                          if (!fieldForm.touched.attributes?.[index]?.value) {
                            fieldForm.setFieldTouched(`attributes[${index}].value`, true);
                          }
                          fieldForm.setFieldValue(`attributes[${index}].value`, value);
                        }}
                        isInvalid={
                          fieldForm.touched.attributes?.[index]?.value &&
                          !!fieldForm.errors.attributes?.[index]?.value
                        }
                        errors={fieldForm.errors.attributes?.[index]?.value}
                        value={fieldForm.values.attributes?.[index]?.value}
                      />
                    </Box>
                  )}
                </Field>
              </FormField>
            )}

            <Field name={`attributes[${index}].attribute_id`}>
              {() => (
                <HiddenField
                  name={`attributes[${index}].attribute_id`}
                  value={attribute.id}
                />
              )}
            </Field>
          </Box>
        ))
      }
    </FieldArray>
  );
};

export default AttributesFieldArray;