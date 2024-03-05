const commaSeparatorRegex = /,/;

export const applyEnvironmentVariable = (
  processEnvironment: NodeJS.ProcessEnv,
  file: string,
  variableName: string
): string => {
    let envVariableValue = processEnvironment[variableName] as string;
  
    // Convert comma separated environment variable to an Javascript Array
    if (commaSeparatorRegex.test(envVariableValue)) {
      console.log(`Converting ${variableName} with ${envVariableValue} value to an Array`);
      envVariableValue = envVariableValue
        .split(',')
        .map((a) => a.trim())
        .join('", "');
    }
  
    // Replace found placeholders with variable value
    return file.replace(new RegExp(variableName, 'g'), envVariableValue);
  };