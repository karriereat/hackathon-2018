import path from 'path';
export default config => {
  config.resolve.alias.components = path.resolve(__dirname, 'components')
}
